/* eslint-disable import/no-extraneous-dependencies */
import express, { Router, Request, Response } from 'express';
import { User } from '../../../model/user';
import { Stream } from '../../../model/stream';

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
      updatedStreams.push({ 'channel': channels[i], 'stream': streams.find(obj => obj.channelID === channels[i].clerk_id) });
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
    return Stream.findOne({ channelID: req.query.channelID }).exec();
  };

  const stream = await getStream();

  if (stream == null) {
    res.status(404).send();
    return;
  }


  
  res.status(200).send(stream);
  return;
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

  const filename = path.join('C:/Users/Tide/Documents/Dev/Tokei/server/media/live/' + key, uri);
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


  // try {
  //   fetch(`http://localhost:${process.env.NMS_PORT}/live/${key}/index.m3u8`)
  //     .then(r => r.body)
  //     .then(s => {
  //       s.pipe(res);
  //     })
  //     .catch(e => {
  //       res.status(500).send(e?.toString());
  //     });
  // } catch (e) {
  //   res.status(500).send(e?.toString());
  // }
});

export default router;

