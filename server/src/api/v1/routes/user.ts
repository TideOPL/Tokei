/* eslint-disable import/no-extraneous-dependencies */
import { clerkClient, ClerkExpressRequireAuth, RequireAuthProp } from '@clerk/clerk-sdk-node';
import express, { Router, Request, Response } from 'express';
import makeKey from '../../../util/makeKey';
import { User } from '../../../model/user';
import { getOrSetCache } from '../../../util/cache';

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
    
    const channel = await getOrSetCache(req.query.channel.toString(), async () => {
      const data = await User.find({ username: req.query.channel }).exec();

      return data;
    }) as Array<any>;

    if (channel[0] == null) {
      res.status(404).send();
      return;
    }


    res.status(200).send(channel[0]);
  } catch (e) {
    res.status(500).send(e?.toString());
  }
});

// Get api/v1/user/follow/getFollowerCount
router.get('/follow/getFollowerCount', async (req: Request, res: Response) => {
  try {
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

    if (channel?.followers == null || channel?.followers == undefined) {
      res.status(200).send('0');
      return;
    }

    res.status(200).send(channel.followers.length.toString());
  } catch (e) {
    res.status(500).send(e?.toString());
  }
});

// Post api/v1/user/follow/follow
router.post('/follow/follow', ClerkExpressRequireAuth(), async (req: RequireAuthProp<Request>, res: Response) => {
  try {
    if (req.query.channel == null && req.auth.userId == null || req.query.channel == undefined && req.auth.userId == undefined) {
      res.status(400).send();
      return;
    }

    const getChannel = async () => {
      return User.findOne({ username: req.query.channel }).exec();
    };

    const getUser = async () => {
      return User.findOne({ clerk_id: req.auth.userId }).exec();
    };

    const channel = await getChannel();
    const user = await getUser();

    if (user == null  || channel == null) {
      res.status(404).send();
      return;
    }

    if (user.clerk_id == undefined || channel.clerk_id == undefined) {
      res.status(500).send();
      return;
    }

    if (user.username == channel.username) {
      res.status(400).send();
    }

    const channelFollowers: string[] = channel.followers;
    const userFollowing: string[] = user.following;

    if (channel.followers.indexOf(user.clerk_id) == -1) {
      channelFollowers.push(user.clerk_id);
      userFollowing.push(channel.clerk_id);

      channel.updateOne({ followers: channelFollowers }).exec();
      user.updateOne({ following: userFollowing }).exec();

      res.status(200).send();
      return;
    } else {
      const updatedChannelFollowers: string[] = channelFollowers.filter(follower => follower !== user.clerk_id);
      const updatedUserFollowing: string[] = userFollowing.filter(following => following !== channel.clerk_id);
  
      channel.updateOne({ followers: updatedChannelFollowers }).exec();
      user.updateOne({ following: updatedUserFollowing }).exec();

      res.status(200).send();
      return;
    }


    res.status(500).send();
  } catch (e) {
    res.status(500).send(e?.toString());
  }
});

// Get api/v1/user/follow/amIFollowing
router.get('/follow/amIFollowing', ClerkExpressRequireAuth(), async (req: RequireAuthProp<Request>, res: Response) => {
  
  try {
    if (req.query.channel == null && req.auth.userId == null) {
      res.status(400).send();
      return;
    }

    const getChannel = async () => {
      return User.findOne({ username: req.query.channel }).exec();
    };

    const getUser = async () => {
      return User.findOne({ clerk_id: req.auth.userId }).exec();
    };

    const channel = await getChannel();
    const user = await getUser();

    if (channel == null || user == null) {
      res.status(404).send();
      return;
    }

    if (user?.following == null) {
      res.status(204).send('false');
      return;
    }

    if (channel.clerk_id == undefined) {
      res.status(500).send();
      return;
    }

    if (user.following.indexOf(channel.clerk_id) == -1) {
      res.status(204).send('false');
      return;
    }

    res.status(200).send('true');
    return;
  } catch (e) {
    res.status(500).send(e?.toString());
  }
});
export default router;

