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
  searchName: {
    require: true,
    type: String,
  },
  tags: {
    require: true,
    type: [String],
  },
  description: {
    require: false,
    type: String,
  },
  age: {
    require: false,
    type: String,
  },
});

export const Category = mongoose.model('Category', category);