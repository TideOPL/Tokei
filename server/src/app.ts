/* eslint-disable import/no-extraneous-dependencies */
import express, {  Express, Request, Response } from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import {
  StrictAuthProp,
} from '@clerk/clerk-sdk-node';
import dotenv from 'dotenv';
import signup from './api/v1/routes/user';
import settings from './api/v1/routes/settings';
import webhook from './api/v1/webhook';
import streams from './api/v1/routes/streams';
import { User } from './model/user';
import mongoose from 'mongoose';
import cors from 'cors';
import { Stream } from './model/stream';
import Redis from 'ioredis';
import { getOrSetCache } from './util/cache';

const NodeMediaServer = require('tokei-media-server');

declare global {
  namespace Express {
    interface Request extends StrictAuthProp {}
  }
}

dotenv.config();

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    port: 8000,
    mediaroot: './media',
    allow_origin: '*',
  },
  trans: {
    ffmpeg: 'C:/ffmpeg/bin/ffmpeg.exe',
    
    tasks: [
      {
        app: 'live',
        hls: true,
        hlsKeep: false,
      },
    ],
  },
};

const app: Express = express();
export const httpServer = createServer(app);
const port = process.env.PORT;
mongoose.connect('mongodb://localhost:27017');
export const database = mongoose.connection;
export const redis =  new Redis(6379, '88.99.60.186', { password: 'TokeiLive2022' });
redis.flushall();

database.on('error', (error) => {
  console.log(error);
});

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

// app.use(compression());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(expressValidator());

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(async (err: Error, req: Request, res: Response, next: () => void) => {
  console.error(err);
  res.sendStatus(401).send();
});


const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://83.104.242.112:3000', 'http://localhost:3001', 'http://83.104.242.112:3001'],
  },
});

io.on('connection', (socket) => {
  let storedChat = '';
  socket.on('join', (chat) => {
    storedChat = chat.chat;

    const viewerFunc = async () => {
      const viewers: Array<string> | null = await redis.lrange(`viewers_${chat.chat}`, 0, -1);

      if (viewers) {
        const viewer: string | number = viewers.indexOf(chat.username);
        if (viewer == -1) {
          await redis.lpush(`viewers_${chat.chat}`, chat.username);
          return;
        }
        return;
      } else {
        await redis.lset(`viewers_${chat.chat}`, chat.username, 0);
      }

      const list: string[] = await redis.lrange(`viewers_${chat.chat}`, 0, -1);


      io.sockets.emit(`viewers_${chat.chat}`, list);
    };

    viewerFunc();
  });
  

  socket.on('leave', (chat) => {

    const viewerFunc = async () => {
      const viewers: Array<string> | null = await redis.lrange(`viewers_${chat.chat}`, 0, -1);

      if (viewers) {
        const viewer: number = viewers.indexOf(chat.username);
        if (viewer != -1) {
          await redis.lrem(`viewers_${chat.chat}`, 1, chat.username);
          return;
        }
      }

      const list: string[] = await redis.lrange(`viewers_${chat.chat}`, 0, -1);
      
      io.sockets.emit(`viewers_${chat.chat}`, list);
    };

    viewerFunc();
  });


  socket.on('message', async (message) => {
    const icons = [];

    const channel = await getOrSetCache(storedChat, async () => {
      const data = await User.find({ username: storedChat }).exec();

      return data;
    }) as Array<any>; 

    const user = await getOrSetCache(message.username, async () => {
      const data = await User.find({ username: message.username }).exec();
      
      return data;
    }) as Array<any>;

    const channelMods = channel[0].channelMods as string[];
    const userClerk = user[0].clerk_id as string;
    const isVerified = user[0].isVerified as boolean;

    if (message.username == storedChat) {
      icons.push('Broadcaster');
    }


    if (channelMods.includes(userClerk)) {
      icons.push('Moderator');
    }

    if (isVerified) {
      icons.push('Verified');
    }

    io.sockets.emit(`message_${storedChat}`, { 'username': message.username, 'color': message.color, 'message': message.message, 'icons': icons });
    const viewerFunc = async () => {
      io.sockets.emit(`viewers_${storedChat}`, await redis.lrange(`viewers_${storedChat}`, 0, -1));
    };

    viewerFunc();
  });
});

export const limiter = rateLimit({
  windowMs: 10 * 1000, // 15 Seconds
  max: 7,
  standardHeaders: true,
  legacyHeaders: false,

  store: new RedisStore({
    // @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
    sendCommand: (...args: string[]) => redis.call(...args),
  }),

});


app.use(cors());
app.use('/api/v1/user/', limiter);
app.use('/api/v1/user/', signup);
app.use('/api/v1/settings/', settings);
app.use('/api/v1/settings/', limiter);
app.use('/api/v1/getStream', limiter);
app.use('/api/v1', streams);
app.use('/api/v1', webhook);

httpServer.listen(8001, () => {
  console.log(`[⚡️]: Server is running at http://localhost:${port}`);
});
 
export const globalNMS = new NodeMediaServer(config);
globalNMS.run();

globalNMS.on('prePublish', (id: any, StreamPath: string) => {
  const key = StreamPath.slice(6, StreamPath.length);

  const findUserFromKey = async (_key: string, _id: string) => {
    const user = await User.findOne({ stream_key: _key }).exec();

  
    console.log(user);
    if (user == null) {
      console.log(_id);
      let session = globalNMS.getSession(_id);
      session.reject();
      return;
    }

    await Stream.findOneAndUpdate({ channelID: user.clerk_id }, { timestamp: Date.now() }).exec();
    
    User.updateOne({ clerk_id: user.clerk_id }, { isLive: true }).exec();
  };

  findUserFromKey(key, id);
});

globalNMS.on('donePublish', (id: any, StreamPath: string) => {
  const key = StreamPath.slice(6, StreamPath.length);

  const findUserFromKey = async (_key: string) => {
    const user = await User.findOne({ stream_key: _key }).exec();
  

    if (user == null) {
      return;
    }

    User.updateOne({ clerk_id: user.clerk_id }, { isLive: false, _nmsId: id }).exec();
  };

  findUserFromKey(key);

});

export default app; 