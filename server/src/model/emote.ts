import mongoose from 'mongoose';

const emote = new mongoose.Schema({
  name: {
    require: true,
    type: String,
  },
  friendly_name: {
    require: true,
    type: String,
  },
  emote: {
    require: true,
    type: String,
  },
});

export const Emote = mongoose.model('Emote', emote);