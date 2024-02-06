import mongoose from 'mongoose';

const category = new mongoose.Schema({
  name: {
    require: true,
    type: String,
  },
  developer: {
    require: false,
    type: String,
  },
  image: {
    require: true,
    type: String,
  },
  weight: {
    require: true,
    type: Number,
  },
});

export const Category = mongoose.model('Category', category);