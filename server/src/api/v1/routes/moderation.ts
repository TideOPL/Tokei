/* eslint-disable import/no-extraneous-dependencies */
import { ClerkExpressRequireAuth, RequireAuthProp } from '@clerk/clerk-sdk-node';
import express, { Router, Request, Response } from 'express';
import { User } from '../../../model/user';
import { Moderator } from '../../../model/moderator';
import { Timeout } from '../../../model/timeout';
import { getOrSetCache } from '../../../util/cache';
import { io, redis } from '../../../app';
import bodyParser from 'body-parser';
import { ChatBan } from '../../../model/chatBan';

const getModerator = async (moderator_id: string, channel_id: string) => {
  return Moderator.findOne({ channel: channel_id, user: moderator_id }).exec();
};

const getUserById = async (clerk_id: string) => {
  return User.findOne({ clerk_id: clerk_id }).exec();
};

const getTimeOutByUserId = async (clerk_id: string, channel_id: string) => {
  return Timeout.findOne({ active: true, channel_id: channel_id, user_id: clerk_id });
};

const getChatBanByUserId = async (clerk_id: string, channel_id: string) => {
  return ChatBan.findOne({ active: true, channel_id: channel_id, user_id: clerk_id });
};

const router: Router = express.Router();

// /api/v1/moderation/timeoutUser
router.post('/timeoutUser', ClerkExpressRequireAuth(), bodyParser.json(), async (req: RequireAuthProp<Request>, res: Response) => {
  try {
    // Check if the request contains the correct body
    if (req.body.user == null || req.body.channel == null || req.body.timestampEnd == null || req.body.reason == null) {
      console.log(req.body);
      res.status(400).send();
      return;
    }

    const user = await getOrSetCache(req.body.user, async () => {
      const data = getUserById(req.body.user);
      
      return data;
    }) as any;

    const moderator = await getOrSetCache(req.auth.userId, async () => {
      const data = getUserById(req.auth.userId);
      
      return data;
    }) as any;

    const channel = await getOrSetCache(req.body.channel, async () => {
      const data = getUserById(req.body.channel);
      
      return data;
    }) as any;

    // Check to see if the moderator, user, & channel object doesn't exist
    if (!moderator || !moderator.clerk_id || !user || !channel) {
      res.status(404).send();
      return;
    }

    // check if user that is being muted is the channel owner
    if (user.clerk_id == channel.clerk_id) {
      res.status(403).send();
      return;
    }
    
    // check if user that is being muted is a moderator
    const isUserMod = await getModerator(user.clerk_id, req.body.channel.toString());
    if (isUserMod) {
      res.status(403).send();
      return;
    }

    const modObj = await getModerator(moderator.clerk_id, req.body.channel.toString());

    // Check if the user is actually a moderator or if the user is the channel owner
    if (modObj || channel.clerk_id == req.auth.userId) {
      // Create new timeout object
      const timeout = await new Timeout({
        channel_id: req.body.channel,
        user_id: user.clerk_id,
        mod_id: moderator.clerk_id || req.auth.userId,
        timestamp_mutedStart: Date.now(),
        timestamp_mutedEnd: req.body.timestampEnd,
        reason: req.body.reason,
        active: true,
      }).save();

      // Respond to client with success and push to webhook that the user has been timed out
      res.status(200).send(timeout);
      io.sockets.emit(`chat_${channel.username}`, `@timeout-${user.username}-reason-${timeout.reason}-end-${timeout.timestamp_mutedEnd}-moderator-${timeout.mod_id}`);
      redis.del(`${user.username}__timeout`);
    }
    res.status(401).send();
  } catch (e) {
    res.status(500).send(e?.toString());
  } 
});

// /api/v1/moderation/unTimeoutUser
router.post('/unTimeoutUser', ClerkExpressRequireAuth(), bodyParser.json(), async (req: RequireAuthProp<Request>, res: Response) => {
  try {
    // Check if the request contains the correct body
    if (req.body.user == null || req.body.channel == null) {
      res.status(400).send();
      return;
    }

    const user = await getOrSetCache(req.body.user, async () => {
      const data = getUserById(req.body.user);
      
      return data;
    }) as any;

    const moderator = await getOrSetCache(req.auth.userId, async () => {
      const data = getUserById(req.auth.userId);
      
      return data;
    }) as any;

    const channel = await getOrSetCache(req.body.channel, async () => {
      const data = getUserById(req.body.channel);
      
      return data;
    }) as any;

    if (!moderator || !moderator.clerk_id || !user || !channel) {
      res.status(404).send();
      return;
    }

    // check if user that is being muted is the channel owner
    if (user.clerk_id == channel.clerk_id) {
      res.status(403).send();
      return;
    }
    
    // check if user that is being muted is a moderator
    const isUserMod = await getModerator(user.clerk_id, req.body.channel.toString());
    if (isUserMod) {
      res.status(403).send();
      return;
    }

    const modObj = await getModerator(moderator.clerk_id, req.body.channel.toString());

    if (modObj || channel.clerk_id == req.auth.userId) {
      const timeout = await Timeout.findOneAndUpdate({ active: true, channel_id: req.body.channel, user_id: req.body.user }, { active: false }).exec();
      
      // Emit to the socket that the user has been untimedout and delete it from redis cache
      if (timeout) {
        res.status(200).send(timeout);
        io.sockets.emit(`chat_${channel.username}`, `@untimeout-${user.username}-reason-${timeout.reason}-end-${timeout.timestamp_mutedEnd}-moderator-${timeout.mod_id}`);
        redis.del(`${user.username}__timeout`);
      }

      res.status(404).send(timeout);
    }
    res.status(401).send();
  } catch (e) {
    res.status(500).send(e?.toString());
  } 
});

// /api/v1/moderation/banUser
router.post('/banUser', ClerkExpressRequireAuth(), bodyParser.json(), async (req: RequireAuthProp<Request>, res: Response) => {
  try {
    if (req.body.user == null || req.body.channel == null || req.body.reason == null) {
      console.log(req.body);
      res.status(400).send();
      return;
    }

    const user = await getOrSetCache(req.body.user, async () => {
      const data = getUserById(req.body.user);
      
      return data;
    }) as any;

    const moderator = await getOrSetCache(req.auth.userId, async () => {
      const data = getUserById(req.auth.userId);
      
      return data;
    }) as any;

    const channel = await getOrSetCache(req.body.channel, async () => {
      const data = getUserById(req.body.channel);
      
      return data;
    }) as any;

    if (!moderator || !moderator.clerk_id || !user || !channel) {
      res.status(404).send();
      return;
    }

    // check if user that is being muted is the channel owner
    if (user.clerk_id == channel.clerk_id) {
      res.status(403).send();
      return;
    }
    
    // check if user that is being muted is a moderator
    const isUserMod = await getModerator(user.clerk_id, req.body.channel.toString());
    if (isUserMod) {
      res.status(403).send();
      return;
    }

    const modObj = await getModerator(moderator.clerk_id, req.body.channel.toString());

    if (modObj || channel.clerk_id == req.auth.userId) {
      const ban = await new ChatBan({
        channel_id: req.body.channel,
        user_id: user.clerk_id,
        mod_id: moderator.clerk_id || req.auth.userId,
        timestamp_bannedOn: Date.now(),
        reason: req.body.reason,
        active: true,
      }).save();

      res.status(200).send(ban);
      io.sockets.emit(`chat_${channel.username}`, `@ban-${user.username}-reason-${ban.reason}-moderator-${ban.mod_id}`);
      redis.del(`${user.username}__ban`);
    }
    res.status(401).send();
  } catch (e) {
    res.status(500).send(e?.toString());
  } 
});

// /api/v1/moderation/unBanUser
router.post('/unBanUser', ClerkExpressRequireAuth(), bodyParser.json(), async (req: RequireAuthProp<Request>, res: Response) => {
  try {
    // Check if the request contains the correct body
    if (req.body.user == null || req.body.channel == null) {
      res.status(400).send();
      return;
    }

    const user = await getOrSetCache(req.body.user, async () => {
      const data = getUserById(req.body.user);
      
      return data;
    }) as any;

    const moderator = await getOrSetCache(req.auth.userId, async () => {
      const data = getUserById(req.auth.userId);
      
      return data;
    }) as any;

    const channel = await getOrSetCache(req.body.channel, async () => {
      const data = getUserById(req.body.channel);
      
      return data;
    }) as any;

    if (!moderator || !moderator.clerk_id || !user || !channel) {
      res.status(404).send();
      return;
    }

    // check if user that is being muted is the channel owner
    if (user.clerk_id == channel.clerk_id) {
      res.status(403).send();
      return;
    }
    
    // check if user that is being muted is a moderator
    const isUserMod = await getModerator(user.clerk_id, req.body.channel.toString());
    if (isUserMod) {
      res.status(403).send();
      return;
    }

    const modObj = await getModerator(moderator.clerk_id, req.body.channel.toString());

    if (modObj || channel.clerk_id == req.auth.userId) {
      const ban = await ChatBan.findOneAndUpdate({ active: true, channel_id: req.body.channel, user_id: req.body.user }, { active: false }).exec();
      
      // Emit to the socket that the user has been untimedout and delete it from redis cache
      if (ban) {
        res.status(200).send(ban);
        io.sockets.emit(`chat_${channel.username}`, `@unban-${user.username}-reason-${ban.reason}-moderator-${ban.mod_id}`);
        redis.del(`${user.username}__ban`);
      }

      res.status(404).send(ban);
    }
    res.status(401).send();
  } catch (e) {
    res.status(500).send(e?.toString());
  } 
});


router.get('/chatStatus', ClerkExpressRequireAuth(), async (req: RequireAuthProp<Request>, res: Response) => {
  try {
    if (req.query.channel == undefined || req.query.channel == null) {
      res.status(400).send();
      return;
    }

    const user = await getOrSetCache(req.auth.userId, async () => {
      const data = await getUserById(req.auth.userId);
      
      return data;
    }) as any;

    const channel = await getOrSetCache(req.query.channel.toString(), async () => {

      if (req.query.channel == null) {
        return null;
      }

      const data = await getUserById(req.query.channel.toString());
      
      return data;
    }) as any;

    if (!channel || !channel.clerk_id || !user || !user.clerk_id) {
      res.status(404).send();
      return;
    }

    const timeout = await getTimeOutByUserId(user.clerk_id, channel.clerk_id);
    const ban = await getChatBanByUserId(user.clerk_id, channel.clerk_id);

    if (ban != null) {
      res.status(302).send({ 'type': 'ban', 'object': ban });
      return;
    }

    if (timeout != null) {
      res.status(302).send({ 'type': 'timeout', 'object': timeout });
      return;
    }

    res.status(200).send(timeout);
    return;
  } catch (e) {
    res.status(500).send(e?.toString());
  } 
});

router.get('/checkChatStatus', ClerkExpressRequireAuth(), async (req: RequireAuthProp<Request>, res: Response) => {
  try {
    if (req.query.channel == null || req.query.user == null) {
      res.status(400).send();
      return;
    }

    const user = await getOrSetCache(req.query.user.toString(), async () => {
      if (req.query.user) {
        const data = getUserById(req.query.user?.toString());

        return data;
      }
      
    }) as any;

    const moderator = await getOrSetCache(req.auth.userId, async () => {
      const data = getUserById(req.auth.userId);
      
      return data;
    }) as any;

    const channel = await getOrSetCache(req.query.channel.toString(), async () => {
      if (req.query.channel) {
        const data = getUserById(req.query.channel.toString());
      
        return data;
      }

    }) as any;

    if (!moderator || !user || !channel) {
      res.status(404).send({ moderator: moderator, user: user, channel: channel });
      return;
    }

    const timeout = await getTimeOutByUserId(user.clerk_id, channel.clerk_id);
    const ban = await getChatBanByUserId(user.clerk_id, channel.clerk_id);

    if (ban != null) {
      res.status(302).send({ 'type': 'ban', 'object': ban });
      return;
    }

    if (timeout != null) {
      res.status(302).send({ 'type': 'timeout', 'object': timeout });
      return;
    }

    res.status(200).send(timeout);
    return;
  } catch (e) {
    res.status(500).send(e?.toString());
  } 
});


export default router;
