/* eslint-disable import/no-extraneous-dependencies */
import { clerkClient, ClerkExpressRequireAuth, RequireAuthProp } from '@clerk/clerk-sdk-node';
import express, { Router, Request, Response } from 'express';
import makeKey from '../../../util/makeKey';
import { User } from '../../../model/user';

const router: Router = express.Router();
// POST /signup
router.post('/', ClerkExpressRequireAuth(), async (req: RequireAuthProp<Request>, res: Response) => {
  try {
    // Create stream key
    await clerkClient.users.updateUserMetadata(req.auth.userId, { privateMetadata: { streamKey: makeKey() } });
  } catch (e) {
    res.status(500).send(e?.toString());
  } 
});

// GET api/v1/user/getChannel
router.get('/getChannel', async (req: Request, res: Response) => {
  try {
    // Check to see if the channel name is in the query
    if (req.query?.channel == null) {
      res.status(400).send();
      return;
    }
    
    const getChannel = async () => {
      console.log(req.query.channel);
      return User.findOne({ username: req.query.channel }).exec();
    };

    const channel = await getChannel();
    console.log(channel);

    if (channel == null) {
      res.status(404).send();
      return;
    }


    res.status(200).send(channel.toJSON());
  } catch (e) {
    res.status(500).send(e?.toString());
  }
});

export default router;

