/* eslint-disable import/no-extraneous-dependencies */
import clerkClient, { ClerkExpressRequireAuth, RequireAuthProp } from '@clerk/clerk-sdk-node';
import express, { Router, Request, Response } from 'express';
import { User } from '../../../model/user';
import makeKey from '../../../util/makeKey';
import { globalNMS } from '../../../app';


const router: Router = express.Router();
// Get /showKey
router.get('/getKey', ClerkExpressRequireAuth(), async (req: RequireAuthProp<Request>, res: Response) => {
  try {
    const getUser = async () => {
      return User.findOne({ clerk_id: req.auth.userId }).exec();
    };

    const user = await getUser();

    if (!user) {
      res.status(404).send();
    }

    res.status(200).send(user?.stream_key);
  } catch (e) {
    res.status(500).send(e?.toString());
  } 
});

// Post /resetKey
router.get('/resetKey', ClerkExpressRequireAuth(), async (req: RequireAuthProp<Request>, res: Response) => {
  try {
    const getUser = async () => {
      return User.findOne({ clerk_id: req.auth.userId }).exec();
    };

    const user = await getUser();

    if (!user) {
      res.status(404).send();
    }

    await user?.updateOne({ stream_key: makeKey(), isLive: false }).exec().then(() => res.status(200).send()).catch(() => res.status(400).send());
    globalNMS.getSession(user?._nmsId || '').reject();

  } catch (e) {
    res.status(500).send(e?.toString());
  } 
});

router.post('/setColor', ClerkExpressRequireAuth(), async (req: RequireAuthProp<Request>, res: Response) => {
  try {
    if (req.query?.color == null) {
      res.status(400).send();
      return;
    }

    await clerkClient.users.updateUserMetadata(req.auth.userId, { publicMetadata: { color: '#' + req.query.color } });
    res.status(200).send();
    return;
  } catch (e) {
    res.status(500).send(e?.toString());
  }

});

export default router;
