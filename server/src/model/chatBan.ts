import mongoose from 'mongoose';

const chatBan = new mongoose.Schema({
  channel_id: {
    require: true,
    type: String,
  },
  user_id: {
    require: true,
    type: String,
  },
  mod_id: {
    require: true,
    type: String,
  },
  timestamp_bannedOn: {
    require: true,
    type: String,
  },
  reason: {
    require: false,
    type: String,
  },
  active: {
    require: true,
    type: String,
  },
});

export const ChatBan = mongoose.model('ChatBan', chatBan);