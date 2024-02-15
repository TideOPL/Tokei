/* eslint-disable import/no-extraneous-dependencies */
import { ClerkExpressRequireAuth, RequireAuthProp } from '@clerk/clerk-sdk-node';
import express, { Router, Request, Response } from 'express';
import { User } from '../../../model/user';

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

export default router;
