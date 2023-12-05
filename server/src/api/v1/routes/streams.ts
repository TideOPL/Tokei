/* eslint-disable import/no-extraneous-dependencies */
import express, { Router, Request, Response } from 'express';
import fetch from 'node-fetch';
import { User } from '../../../model/user';

const router: Router = express.Router();
// POST /getAllStreams
router.post('/getAllStreams', async (req: Request, res: Response) => {
  try {
    // Create stream key

  } catch (e) {
    res.status(500).send(e?.toString());
  } 
});

router.get('/live.flv', async (req: Request, res: Response) => {
  if (req.query?.channel == null) {
    res.status(400).send();
    return;
  }

  const getChannel = async () => {
    return User.findOne({ username: req.query.channel }).exec();
  };

  const channel = await getChannel();

  if (channel == null) {
    res.status(404).send();
    return;
  }

  const key = channel.stream_key;

  try {
    fetch(`http://localhost:${process.env.NMS_PORT}/live/${key}.flv`)
      .then(r => r.body)
      .then(s => {
        s.pipe(res);
      })
      .catch(e => {
        res.status(500).send(e?.toString());
      });
  } catch (e) {
    res.status(500).send(e?.toString());
  }
});

export default router;

