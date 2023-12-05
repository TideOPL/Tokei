/* eslint-disable import/no-extraneous-dependencies */
import express, {  Express, Request, Response } from 'express';
import {
  ClerkExpressRequireAuth,
  RequireAuthProp,
  StrictAuthProp,
} from '@clerk/clerk-sdk-node';

import dotenv from 'dotenv';

import signup from './api/v1/routes/user';
import webhook from './api/v1/webhook';
import streams from './api/v1/routes/streams';
import { User } from './model/user';
import mongoose from 'mongoose';
import cors from 'cors';
import { Stream } from './model/stream';

const NodeMediaServer = require('node-media-server');

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
    allow_origin: '*',
  },
};

const app: Express = express();
const port = process.env.PORT;
mongoose.connect('mongodb://localhost:27017');
export const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error);
});

declare global {
  namespace Express {
    interface Request extends StrictAuthProp {}
  }
}

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

// app.use(compression());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(expressValidator());

app.get(
  '/protected-route',
  ClerkExpressRequireAuth({
    onError: (err) => {
      console.log(err);
    },
  }),
  (req: RequireAuthProp<Request>, res) => {
    res.json(req.auth);
  },
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(async (err: Error, req: Request, res: Response, next: () => void) => {
  console.error(err);
  res.sendStatus(401).send();
});

app.use(cors());
app.use('/api/v1/user/', signup);
app.use('/api/v1', streams);
app.use('/api/v1', webhook);

app.listen(port?.toString, () => {
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


    const stream = new Stream({ streamTitle: 'Testing Stream Title 1', userID: user.clerk_id });

    stream.save();
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

    await Stream.findOne({ userID: user.clerk_id }).deleteOne().exec();
    User.updateOne({ clerk_id: user.clerk_id }, { isLive: false }).exec();
  };

  findUserFromKey(key);

});

export default app;



// import express from 'express';
// import morgan from 'morgan';
// import mongoose from 'mongoose';
// import helmet from 'helmet';
// import cors from 'cors';
// // import createUser from 'routes'
// import * as middlewares from './middlewares';
// import api from './api';
// import MessageResponse from './interfaces/MessageResponse';

// require('dotenv').config();
// const NodeMediaServer = require('node-media-server');

// const app = express();
// mongoose.connect('mongodb://localhost:27017');
// export const database = mongoose.connection;

// database.on('error', (error) => {
//   console.log(error);
// });

// database.once('connected', () => {
//   console.log('Database Connected');
// });

// const config = {
//   rtmp: {
//     port: 1935,
//     chunk_size: 60000,
//     gop_cache: true,
//     ping: 30,
//     ping_timeout: 60
//   },
//   http: {
//     port: 8000,
//     allow_origin: '*'
//   }
// };

// app.use(morgan('dev'));
// app.use(helmet());
// app.use(cors());
// app.use(express.json());

// app.get<{}, MessageResponse>('/', (req, res) => {
//   res.json({
//     message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
//   });
// });


// app.use('/api/v1', api);

// app.use(middlewares.notFound);
// app.use(middlewares.errorHandler);
// // app.use(createUser)

// export const globalNMS = new NodeMediaServer(config)
// globalNMS.run();



// export default app;
