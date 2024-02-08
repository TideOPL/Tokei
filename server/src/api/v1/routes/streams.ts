/* eslint-disable import/no-extraneous-dependencies */
import express, { Router, Request, Response } from 'express';
import { User } from '../../../model/user';
import { Stream } from '../../../model/stream';
import { env } from 'process';
import { ClerkExpressRequireAuth, RequireAuthProp } from '@clerk/clerk-sdk-node';

var fs = require('fs');
var path = require('path');
var zlib = require('zlib');

const router: Router = express.Router();
// POST /getAllStreams
router.get('/getAllStreams', async (req: Request, res: Response) => {
  try {
    const getAllLiveChannels = async () => {
      return User.find({ isLive: true }).exec();
    };

    const getAllLiveStreams = async () => {
      return Stream.find().exec();
    };

    const channels = await getAllLiveChannels();
    const streams = await getAllLiveStreams();

    const updatedStreams = [];

    if (streams.length == 0) {
      res.status(204).send();
    }

    for (let i = 0; i < channels.length; i++) {
      updatedStreams.push({ 'channel': channels[i], 'stream': streams.find(obj => obj.clerkId === channels[i].clerk_id) });
    }

    res.status(200).send(updatedStreams);
    return;
  } catch (e) {
    res.status(500).send(e?.toString());
  } 
});

router.get('/getStream', async (req: Request, res: Response) => {
  if (req.query?.channelID == null) {
    res.status(400).send();
    return;
  }

  const getStream = async () => {
    return Stream.findOne({ clerkId: req.query.channelID }).exec();
  };

  const stream = await getStream();

  if (stream == null) {
    res.status(404).send();
    return;
  }

  res.status(200).send(stream);
  return;
});

router.get('/getThumbnail/:channel', async (req: Request, res: Response) => {
  console.log(req.params.channel);
  const getChannel =  async () => {
    return User.findOne({ username: req.params.channel }).exec();
  };

  const channel = await getChannel();
  if (channel != null) {
    const filePath = path.join(env.MEDIA_PATH + '/' + channel.stream_key + '/thumb.png');
    console.log(filePath);

    fs.exists(filePath, (exists: boolean) => {
      if (!exists) {
        res.status(404).send(exists);
        return;
      }
      
      fs.readFile(filePath, (err: any, content: any) => {
        if (err) {
          res.status(500).send(err);
        }

        res.setHeader('content-type', 'image/png');
        res.status(200).send(content);
        return;
      });
    });
    return;
  }
  res.status(404).send();

  return;
});


router.post('/updateStreamInfo', ClerkExpressRequireAuth(), async (req: RequireAuthProp<Request>, res: Response) => {
  if (req.body.title == null || req.body.tags == null || req.body.category == null) {
    res.status(401).send();
  }

  const updateStream = async (title: string, tags: string[], category: string) => {
    return Stream.findOneAndUpdate({ clerkId: req.auth.userId }, { title: title, tags: tags, category: category }).exec();
  };
  
  const stream = await updateStream(req.body.title, req.body.tags, req.body.category);

  if (stream) {
    res.status(200).send(stream);
    return;
  }

  res.status(404).send();
});

router.get('/:channel/:filename', async (req: Request, res: Response) => {
  const getChannel = async () => {
    return User.findOne({ username: req.params.channel }).exec();
  };

  const channel = await getChannel();

  if (channel == null) {
    res.status(404).send();
    return;
  }

  const key = channel.stream_key;

  const uri = req.params.filename;

  const filename = path.join((process.env.MEDIA_PATH || '') + key, uri);
  fs.exists(filename, function (exists: boolean) {
    if (!exists) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('file not found: %s\n', filename);
      res.end();
    } else {
      switch (path.extname(uri)) {
        case '.m3u8':
          fs.readFile(filename, function (err: any, contents: any) {
            if (err) {
              res.writeHead(500);
              res.end();
            } else if (contents) {
              res.appendHeader('Content-Type', 'application/vnd.apple.mpegurl');
              var ae = req.headers['accept-encoding'];
              {/**@ts-ignore**/}
              if (ae.match(/\bgzip\b/)) {
                zlib.gzip(contents, function (error: any, zip: any) {
                  if (error) throw error;
                  res.writeHead(200,
								    { 'content-encoding': 'gzip' });
                  res.end(zip);
                });
              } else {
                res.end(contents, 'utf-8');
              }
            } else {
              console.log('emptly playlist');
              res.writeHead(500);
              res.end();
            }
          });
          break;
        case '.ts':
          res.writeHead(200, { 'Content-Type':
				    'video/MP2T' });
          var stream = fs.createReadStream(filename,
				    { bufferSize: 64 * 1024 });
          stream.pipe(res);
          break;
        default:
          console.log('unknown file type: ' +
				    path.extname(uri));
          res.writeHead(500);
          res.end();
      }
    }
  });
});

export default router;

