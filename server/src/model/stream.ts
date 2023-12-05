import mongoose from 'mongoose';

const stream = new mongoose.Schema({
  streamTitle: {
    require: true,
    type: String,
  },
  userID: {
    require: true,
    type: String,
  },
});

export const Stream = mongoose.model('Stream', stream);