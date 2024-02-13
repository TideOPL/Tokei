/* eslint-disable import/no-extraneous-dependencies */
import clerkClient, { WebhookEvent } from '@clerk/clerk-sdk-node';
import bodyParser from 'body-parser';
import express, { Request, Response, Router } from 'express';
import { Webhook } from 'svix';
import makeKey from '../../util/makeKey';
import { User } from '../../model/user';
import { Stream } from '../../model/stream';
import getColor from '../../util/getColor';
import { buffer } from 'micro';

export const config = {
  api: {
    bodyParser: false,
  },
};

const router: Router = express.Router();
// POST /signup
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  if (req.method !== 'POST') {
    return res.status(405);
  }
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
 
  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }
 
  // Get the headers
  const svixId = req.headers['svix-id'] as string;
  const svixTimestamp = req.headers['svix-timestamp'] as string;
  const svixSignature = req.headers['svix-signature'] as string;
 
 
  // If there are no headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
    return res.status(400).json({ error: 'Error occured -- no svix headers' });
  }
 
  console.log('headers', req.headers, svixId, svixSignature, svixTimestamp);
  // Get the body
  const body = (await buffer(req)).toString();
 
  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);
 
  let evt: WebhookEvent;
 
  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return res.status(400).json({ 'Error': err });
  }
 
  // Grab the ID and TYPE of the Webhook
  // const { id } = evt.data;
  const eventType = evt.type;
 
  if (eventType == 'user.created') {
    try {
      // Create stream key
      const key = makeKey();
      await clerkClient.users.updateUserMetadata(evt.data.id, { privateMetadata: { streamKey: key } });
      await clerkClient.users.updateUserMetadata(evt.data.id, { publicMetadata: { color: getColor() } });

      const username = evt.data.username == null ? evt.data.first_name : evt.data.username;

      const user = new User({
        clerk_id: evt.data.id,
        username: username,
        isLive: false,
        stream_key: key,
        pfp: evt.data.image_url,
        channelMods: [],
        followers: [],
        following: [],
        isVerified: false,
      });
      user.save();

      // Setup account
      const stream = new Stream({
        title: username + '\'s Stream!',
        category: '65c0d5698a87935e4b444013',
        clerkId: evt.data.id,
        timestamp: '0',
        tags: [],
      });
      stream.save();

    } catch (e) {
      console.warn('[⚠] ' + e);
    }
  
  }

  if (eventType == 'user.deleted') {
    try {
      const user = await User.findOne({ clerk_id: evt.data.id }).exec();

      if (user == null) {
        return;
      }

      user.deleteOne().exec();
    } catch (e) {
      console.warn('[⚠] Caught error whilst trying to delete user via webhook.');
    }
  }

  if (eventType == 'user.updated') {
    try {
      await User.findOneAndUpdate({ clerk_id: evt.data.id }, { pfp: evt.data.image_url }).exec();
    } catch (e) {
      console.warn('[⚠] Caught error whilst trying to update user via webhook.');

    }
  }
 
  return res.status(200).json({
    success: true,
    message: 'Webhook received',
  });
});

export default router;
