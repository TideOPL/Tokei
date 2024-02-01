import express, { Router, Request, Response } from 'express';
import { Emote } from '../../../model/emoji';

const router: Router = express.Router();
// Get /chat/getEmotes
router.get('/getEmotes', async (req: Request, res: Response) => {
  try {
    const emotes = await Emote.find({}).exec();
    res.status(200).send(emotes);
  } catch (e) {
    res.status(500).send(e?.toString());
  } 
});

export default router;