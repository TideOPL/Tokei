import mongoose from 'mongoose';

const stream = new mongoose.Schema({
  streamTitle: {
    require: true,
    type: String,
  },
  category: {
    require: true,
    type: String,
  },
  channelID: {
    require: true,
    type: String,
  },
  timestamp: {
    require: true,
    type: String,
  },
  tags: {
    require: true,
    type: Array<String>,
  },
});

export const Stream = mongoose.model('Stream', stream);