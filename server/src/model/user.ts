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
  stream_key: {
    require: true,
    type: String,
  },
});

user.set('toJSON', {
  versionKey: false,
  transform: function (doc, ret) { delete ret.stream_key; },
});

export const User = mongoose.model('User', user);