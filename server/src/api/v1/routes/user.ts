/* eslint-disable import/no-extraneous-dependencies */
import { clerkClient, ClerkExpressRequireAuth, RequireAuthProp } from '@clerk/clerk-sdk-node';
import express, { Router, Request, Response } from 'express';
import makeKey from '../../../util/makeKey';
import { User } from '../../../model/user';
import { getOrSetCache } from '../../../util/cache';
import { Follower } from '../../../model/follower';
import { Moderator } from '../../../model/moderator';
import { redis } from '../../../app';

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

const getChannel = async (username: string) => {
  return User.findOne({ username: username }).exec();
};

const getUserById = async (clerk_id: string) => {
  return User.findOne({ clerk_id: clerk_id }).exec();
};

const getUserByUsername = async (username: string) => {
  return User.findOne({ username: username }).exec();
};

const getFollow = async ( clerk_id: string, channelId: string ) => {
  return Follower.findOne({ user_id: clerk_id, channel_id: channelId }).exec();
};

const getFollowByObjectID = async (objectId: string) => {
  return Follower.findById(objectId).exec();
};

const getModerate = async ( channel_id: string, moderator_id: string) => {
  return Moderator.findOne({ channel: channel_id, user: moderator_id }).exec();
};

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

    const getFollowCount = async (channelId: string) => {
      return Follower.find({ channel_id: channelId });
    };

    const channel = await getChannel(req.query.channel.toString());

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
    if (req.query.channel == null) {
      res.status(400).send();
      return;
    }

    const channel = await getChannel(req.query.channel.toString());
    const user = await getUserById(req.auth.userId);

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

    let follow = await getFollow( req.auth.userId, channel.clerk_id );

    const channelFollowers: string[] = channel.followers;
    const userFollowing: string[] = user.following;
    
    if (follow) {
      const followId = follow._id.toString();
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
    }).save();

    const followId = follow._id.toString();

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
    if (req.query.channel == null || req.auth.userId == null) {
      res.status(400).send();
      return;
    }

    const channel = await getChannel(req.query.channel.toString());
    const user = await getUserById(req.auth.userId);

    if (channel == null || user == null) {
      res.status(404).send();
      return;
    }

    if (channel.clerk_id == undefined) {
      res.status(500).send();
      return;
    }

    const following = await getFollow(req.auth.userId, channel.clerk_id);
    
   
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

// Get api/v1/user/follow/followCheck
router.get('/follow/followCheck', async (req: Request, res: Response) => {
  try {
    if (req.query.channel == null || req.query.user == null) {
      res.status(400).send();
      return;
    }
    const channel = await getChannel(req.query.channel.toString());
    const user = await getUserByUsername(req.query.user.toString());

    if (user == null || channel == null) {
      res.status(404).send();
      return;
    }

    if (user.clerk_id == null || channel.clerk_id == null) {
      res.status(500).send();
      return;
    }

    const follow = await getFollow(user.clerk_id.toString(), channel.clerk_id.toString());

    if (follow) {
      res.status(200).send(follow.toJSON());
      return;
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/follow/getFollowingList', ClerkExpressRequireAuth(), async (req: RequireAuthProp<Request>, res: Response) => {
  try {
    // Get all follow objects from the user
    const user = await getUserById(req.auth.userId);

    if (user == null || user.following == null) {
      res.status(404).send();
      return;
    }

    const followObjects: any[] = [];
    for (let i = 0; i < user.following.length; i++) {
      const followObject = await getFollowByObjectID(user.following[i]);
      followObjects.push(followObject);
    }

    const channels: Object[] = [];
    // Loop through the follow objects gathering user models
    for (let j = 0; j < followObjects.length; j++) {
      const channel = await getUserById(followObjects[j].channel_id);
      if (channel) {
        channels.push(channel.toJSON());
      }
    }

    res.status(200).send(channels);
    // return list of user models
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/moderation/addMod', ClerkExpressRequireAuth(), async (req: RequireAuthProp<Request>, res: Response) => {
  try {
    if (req.query.channel == null) {
      res.status(400).send();
      return;
    }

    const moderator = await getChannel(req.query.channel.toString());
    const authUser = await getUserById(req.auth.userId);

    if (authUser == null  || moderator == null) {
      res.status(404).send();
      return;
    }

    if (authUser.clerk_id == undefined || moderator.clerk_id == undefined) {
      res.status(500).send();
      return;
    }

    if (authUser.username == moderator.username) {
      res.status(400).send();
      return;
    }

    let moderate = await getModerate( req.auth.userId, moderator.clerk_id );

    const channelMods = authUser.channelMods;

    
    if (moderate) {
      const moderateId = moderate._id.toString();
      const updatedUserMod: string[] = channelMods.filter(_moderator => _moderator !== moderateId);
  
      
      authUser.updateOne({ channelMods: updatedUserMod }).exec();

      moderate.deleteOne().exec();

      res.status(200).send();
      return;

    }
    moderate = await new Moderator({
      channel: authUser.clerk_id,
      user: moderator.clerk_id,
    }).save();

    const moderatorId = moderate._id.toString();

   
    channelMods.push(moderatorId);

    authUser.updateOne({ channelMods: channelMods }).exec();
    await redis.del(req.auth.userId);

    res.status(200).send();
    return;

  } catch (e) {
    res.status(500).send(e?.toString());
  }
});

// Get api/v1/user/moderation/amIMod
router.get('/moderation/amIMod', ClerkExpressRequireAuth(), async (req: RequireAuthProp<Request>, res: Response) => {
  try {
    if (req.query.channel == null || req.auth.userId == null) {
      res.status(400).send();
      return;
    }
    const moderator = await getChannel(req.auth.userId.toString());
    const channel = await getUserByUsername(req.query.channel.toString());

    if (channel == null || moderator == null) {
      res.status(404).send();
      return;
    }

    if (channel.clerk_id == null || moderator.clerk_id == null) {
      res.status(500).send();
      return;
    }

    const moderatorObject = await getModerate(channel.clerk_id, moderator.clerk_id.toString());

    if (moderatorObject) {
      res.status(200).send(moderatorObject.toJSON());
      return;
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/moderation/modCheck', ClerkExpressRequireAuth(), async (req: RequireAuthProp<Request>, res: Response) => {
  try {
    if (req.query.channel == null) {
      res.status(400).send();
      return;
    }
  
    const channel = await getChannel(req.auth.userId.toString());
    const moderator = await getUserByUsername(req.query.channel.toString());

    if (channel == null || moderator == null) {
      res.status(404).send();
      return;
    }

    if (channel.clerk_id == null || moderator.clerk_id == null) {
      res.status(500).send();
      return;
    }

    const moderatorObject = await getModerate(channel.clerk_id, moderator.clerk_id.toString());

    if (moderatorObject) {
      res.status(200).send(moderatorObject.toJSON());
      return;
    }

    res.status(204).send();


  } catch (err) {
    res.status(500).send(err);
  }
});



export default router;

