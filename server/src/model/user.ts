import mongoose from 'mongoose';

const user = new mongoose.Schema({
  clerk_id: {
    require: true,
    type: String,
  },
  username: {
    require: true,
    type: String,
  },
  isLive: {
    require: true,
    type: Boolean,
  },
  isVerified: {
    require: true,
    type: Boolean,
  },
  stream_key: {
    require: true,
    type: String,
  },
  _nmsId: {
    require: false,
    type: String,
  },
  pfp: {
    require: true,
    type: String,
  },
  followers: {
    require: true,
    type: [String], // List of other Channel Clerk IDs
  },
  following: {
    require: true,
    type: [String], // List of other Channel Clerk IDs
  },
  channelMods: {
    require: true,
    type: [String], // List of other Channel Clerk IDs
  },
});

user.set('toJSON', {
  versionKey: false,
  transform: function (doc, ret) { delete ret.stream_key; delete ret._nmsId; delete ret.followers; delete ret.following; },
});

export const User = mongoose.model('User', user);