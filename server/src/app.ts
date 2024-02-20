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
import chats from './api/v1/routes/chat';
import categories from './api/v1/routes/categories';
import moderate from './api/v1/routes/moderation';
import { User } from './model/user';
import mongoose from 'mongoose';
import cors from 'cors';
import { Stream } from './model/stream';
import Redis from 'ioredis';
import { getOrSetCache } from './util/cache';
import bodyParser from 'body-parser';
import { Moderator } from './model/moderator';
import cron from 'node-cron';
import { Timeout } from './model/timeout';

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
    ffmpeg: process.env.FFMPEG_PATH,
    
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
export const redis =  new Redis(6379, process.env.REDIS || '', { password: 'TokeiLive2022' });
redis.flushall();

database.on('error', (error) => {
  console.warn(error);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(async (err: Error, req: Request, res: Response, next: () => void) => {
  console.error(err);
  res.sendStatus(401).send();
});


export const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://83.104.242.112:3000', 'http://localhost:3001', 'http://83.104.242.112:3001', 'https://www.tokei.live', 'https://tokei.live'],
  },
});

io.on('connection', (socket) => {
  let storedChat = '';
  socket.on('join', (chat) => {
    storedChat = chat.chat;
    const address = socket.handshake.headers['x-forwarded-for']?.toString().split(',')[0] || '';

    const viewerFunc = async () => {
      const viewers: Array<string> | null = await redis.lrange(`viewers_${chat.chat}`, 0, -1);

      if (viewers) {
        const viewer: string | number = viewers.indexOf(address.toString());
        if (viewer == -1) {
          await redis.lpush(`viewers_${chat.chat}`, address.toString());
          return;
        }
        return;
      } else {
        await redis.lset(`viewers_${chat.chat}`, address.toString(), 0);
      }

      const list: string[] = await redis.lrange(`viewers_${chat.chat}`, 0, -1);


      io.sockets.emit(`viewers_${chat.chat}`, list.length);
    };

    viewerFunc();
  });
  

  socket.on('disconnect', () => {
    const address = socket.handshake.headers['x-forwarded-for']?.toString().split(',')[0] || '';

    const viewerFunc = async () => {
      const viewers: Array<string> | null = await redis.lrange(`viewers_${storedChat}`, 0, -1);

      if (viewers) {
        const viewer: number = viewers.indexOf(address.toString());
        if (viewer != -1) {
          await redis.lrem(`viewers_${storedChat}`, 1, address.toString());
          return;
        }
      }

      const list: string[] = await redis.lrange(`viewers_${storedChat}`, 0, -1);
      
      io.sockets.emit(`viewers_${storedChat}`, list.length);
    };

    viewerFunc();
  });


  socket.on('message', async (message) => {
    const icons = [];

    const channel = await getOrSetCache(storedChat, async () => {
      const data = await User.findOne({ username: storedChat }).exec();

      return data;
    }) as any; 

    const user = await getOrSetCache(message.username, async () => {
      const data = await User.findOne({ username: message.username }).exec();
      
      return data;
    }) as any;

    const channelMods = channel.channelMods as string[];
    const userClerk = user.clerk_id as string;
    const isVerified = user.isVerified as boolean;

    //TODO: Check on the backend if the message sender is timed out on this channel.

    if (message.username == storedChat) {
      icons.push('Broadcaster');
    }

    const moderatorsObject = await getOrSetCache('mods_' + channel.username, async () => {
      const data = await Moderator.find({ channel: channel.clerk_id }).exec();

      return data;
    }) as any;

    const moderatorObject = moderatorsObject.filter((item: { user: string; channel: string; }) => item.user === userClerk);
    console.log(moderatorObject);

    if (moderatorObject.length != 0) {
      if (channelMods.includes(moderatorObject[0]._id)) {
        icons.push('Moderator');
      }  
    }

    if (isVerified) {
      icons.push('Verified');
    }

    io.sockets.emit(`message_${storedChat}`, { 'username': message.username, 'color': message.color, 'message': message.message, 'icons': icons });
    const viewerFunc = async () => {
      io.sockets.emit(`viewers_${storedChat}`, (await redis.lrange(`viewers_${storedChat}`, 0, -1)).length);
    };

    viewerFunc();
  });


});

export const limiter = rateLimit({
  windowMs: 10 * 1000, // 15 Seconds
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,

  store: new RedisStore({
    // @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
    sendCommand: (...args: string[]) => redis.call(...args),
  }),

});


app.use('/api/v1/user/', bodyParser.json());
app.use('/api/v1/categories/', bodyParser.json());
app.use('/api/v1/chat/', bodyParser.json());
app.use('/api/v1/settings/', bodyParser.json());
app.use('/api/v1/updateStreamInfo', bodyParser.json());
app.use('/api/v1/moderate/', bodyParser.json());
app.use(cors());
app.use('/api/v1/user/',       limiter);
app.use('/api/v1/categories/', categories);
app.use('/api/v1/user/',       signup);
app.use('/api/v1/moderate/',   moderate);
app.use('/api/v1/chat',        chats);
app.use('/api/v1/settings/',   settings);
app.use('/api/v1/settings/',   limiter);
app.use('/api/v1/getStream',   limiter);
app.use('/api/v1',             streams);
app.use('/api/v1',             webhook);

httpServer.listen(8001, '0.0.0.0', () => {
  console.log(`[⚡️]: Server is running at http://localhost:${port}`);
});
 

cron.schedule('* * 1 * *', async () => {
  const getTimeouts = async () => {
    return Timeout.find().exec();
  };

  const timeouts = await getTimeouts();
  const time = Date.now();
  for (let i = 0; i < timeouts.length; i++) {
    if (parseInt(timeouts[i].timestamp_mutedEnd || '') > time) {
      await timeouts[i].updateOne({ active: false }).exec();
      console.log(timeouts[i]);
    }
  }
}).start();

export const globalNMS = new NodeMediaServer(config);
globalNMS.run();

globalNMS.on('prePublish', (id: any, StreamPath: string) => {
  const key = StreamPath.slice(6, StreamPath.length);

  const findUserFromKey = async (_key: string, _id: string) => {
    const user = await User.findOne({ stream_key: _key }).exec();

    if (user == null || user.username == null) {
      let session = globalNMS.getSession(_id);
      session.reject();
      return;
    }

    await Stream.findOneAndUpdate({ clerkId: user.clerk_id }, { timestamp: Date.now() }).exec();
    
    User.updateOne({ clerk_id: user.clerk_id }, { isLive: true }).exec();
    await redis.del(user.username.toString());
    io.emit(`stream_${user.username}`, 'live');
  };

  findUserFromKey(key, id);
});

globalNMS.on('donePublish', (id: any, StreamPath: string) => {
  const key = StreamPath.slice(6, StreamPath.length);

  const findUserFromKey = async (_key: string) => {
    const user = await User.findOne({ stream_key: _key }).exec();
  

    if (user == null || user.username == null) {
      return;
    }

    User.updateOne({ clerk_id: user.clerk_id }, { isLive: false, _nmsId: id }).exec();
    await redis.del(user.username.toString());
    io.emit(`stream_${user.username}`, 'ended');
  };

  findUserFromKey(key);

});

export default app; 