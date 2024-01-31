/* eslint-disable import/no-extraneous-dependencies */
import { clerkClient, ClerkExpressRequireAuth, RequireAuthProp } from '@clerk/clerk-sdk-node';
import express, { Router, Request, Response } from 'express';
import makeKey from '../../../util/makeKey';
import { User } from '../../../model/user';
import { getOrSetCache } from '../../../util/cache';
import { Follower } from '../../../model/follower';
import { timeStamp } from 'console';

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

    const getFollowCount = async (channelId: string) => {
      return Follower.find({ channel_id: channelId })
    }

    const channel = await getChannel();

    if (channel == null || channel.clerk_id == null) {
      res.status(404).send();
      return;
    }

    const followList = await getFollowCount(channel.clerk_id);

    if (!followList) {
      res.status(200).send('0');
      return;
    }

    res.status(200).send(followList.length.toString());
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

    const getFollow = async ( channelId: string ) => {
      return Follower.findOne({ user_id: req.auth.userId, channel_id: channelId }).exec();
    }

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

    //Check with Obi
    let follow = await getFollow( channel.clerk_id );

    const channelFollowers: string[] = channel.followers;
    const userFollowing: string[] = user.following;
    
    console.log(follow)

    if (follow) {
      const followId = follow._id.toString()
      const updatedChannelFollowers: string[] = channelFollowers.filter(follower => follower !== followId);
      const updatedUserFollowing: string[] = userFollowing.filter(following => following !== followId);
  
      channel.updateOne({ followers: updatedChannelFollowers }).exec();
      user.updateOne({ following: updatedUserFollowing }).exec();

      follow.deleteOne().exec();

      res.status(200).send();
      return;

    }

    follow = await new Follower({
      user_id: user.clerk_id,
      channel_id: channel.clerk_id,
      timestamp: Date.now().toString(),
    }).save()

    const followId = follow._id.toString()

    channelFollowers.push(followId);
    userFollowing.push(followId);

    channel.updateOne({ followers: channelFollowers }).exec();
    user.updateOne({ following: userFollowing }).exec();

    res.status(200).send();
    return;

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

    const getFollow = async (channelId: string) => {
      return Follower.findOne({ user_id: req.auth.userId, channel_id: channelId })
    }

    const getUser = async () => {
      return User.findOne({ clerk_id: req.auth.userId }).exec();
    };

    const channel = await getChannel();
    const user = await getUser();

    if (channel == null || user == null) {
      res.status(404).send();
      return;
    }

    if (channel.clerk_id == undefined) {
      res.status(500).send();
      return;
    }

    const following = await getFollow(channel.clerk_id);
    
   
    if (!following) {
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

