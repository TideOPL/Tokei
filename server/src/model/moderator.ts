import mongoose from 'mongoose';

const moderator = new mongoose.Schema({
  channel: {
    require: true,
    type: String,
  },
  user: {
    require: true,
    type: String,
  },
});

// moderator.set('toJSON', {
//   versionKey: false,
//   transform: function (doc, ret) { delete ret.user_id; delete ret.channel_id; },
// });


export const Moderator = mongoose.model('Moderator', moderator);