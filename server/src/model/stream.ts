import mongoose from 'mongoose';

const stream = new mongoose.Schema({
  clerkId: {
    require: true,
    type: String,
  },
  title: {
    require: true,
    type: String,
  },
  category: {
    require: true,
    type: String,
  },
  tags: {
    require: true,
    type: Array<String>,
  },
  timestamp: {
    require: true,
    type: String,
  },
});

export const Stream = mongoose.model('Stream', stream);