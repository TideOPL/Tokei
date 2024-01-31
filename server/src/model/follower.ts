import mongoose from 'mongoose';

const follower = new mongoose.Schema({
  user_id: {
    require: true,
    type: String,
  },
  channel_id: {
    require: true,
    type: String,
  },
  timestamp: {
    require: true,
    type: String,
  },
});

follower.set('toJSON', {
  versionKey: false,
  transform: function (doc, ret) { delete ret.user_id; delete ret.channel_id; },
});


export const Follower = mongoose.model('Follower', follower);