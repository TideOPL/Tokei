import mongoose from 'mongoose';

const timeout = new mongoose.Schema({
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
  timestamp_mutedStart: {
    require: true,
    type: String,
  },
  timestamp_mutedEnd: {
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

export const Timeout = mongoose.model('Timeout', timeout);