/* eslint-disable import/no-extraneous-dependencies */
import clerkClient, { WebhookEvent } from '@clerk/clerk-sdk-node';
import bodyParser from 'body-parser';
import express, { Request, Response, Router } from 'express';
import { Webhook } from 'svix';
import makeKey from '../../util/makeKey';
import { User } from '../../model/user';
import { Stream } from '../../model/stream';
import getColor from '../../util/getColor';

const router: Router = express.Router();
// POST /signup
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  // Check if the 'Signing Secret' from the Clerk Dashboard was correctly provided
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error('You need a WEBHOOK_SECRET in your .env');
  }
 
  // Grab the headers and body
  const headers = req.headers;
  const payload = req.body;
 
  // Get the Svix headers for verification
  const svixId = headers['svix-id'] as string;
  const svixTimestamp = headers['svix-timestamp'] as string;
  const svixSignature = headers['svix-signature'] as string;
 
  // If there are missing Svix headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    });
  }
 
  // Initiate Svix
  const wh = new Webhook(WEBHOOK_SECRET);
 
  let evt: WebhookEvent;
 
  // Attempt to verify the incoming webhook
  // If successful, the payload will be available from 'evt'
  // If the verification fails, error out and  return error code
  try {
    evt = wh.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
  } catch (err: any) {
    // Console log and return errro
    console.log('Webhook failed to verify. Error:', err.message);
    return res.status(400).json({
      success: false,
      message: err.message,
    });
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
      });
      user.save();

      // Setup account
      const stream = new Stream({
        streamTitle: username + '\'s Stream!',
        category: 'Just Chatting',
        channelID: evt.data.id,
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
