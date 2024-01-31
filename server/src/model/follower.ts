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
  }
});

export const Follower = mongoose.model('Follower', follower);