import mongoose from 'mongoose';

const rawCategory = new mongoose.Schema({
  appid: {
    require: true,
    type: Number,
  },
  name: {
    require: true,
    type: String,
  },
  developer: {
    require: true,
    type: String,
  },
  average_2weeks: {
    require: true,
    type: Number,
  },
});

export const RawCategory = mongoose.model('RawCategory', rawCategory);