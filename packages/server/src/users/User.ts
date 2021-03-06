import mongoose, { Schema } from 'mongoose';
import User from '../types/User';
const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true, min: 4 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, min: 12 },
  confirmed: { type: Boolean, default: false },
  avatar: { type: String, default: 'icon.svg' },
  communities: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Community',
    },
  ],
  bans: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Community',
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  karma: {
    type: Number,
    default: 0,
  },
  upvotedPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  downvotedPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  upvotedComments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  downvotedComments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  savedPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  savedComments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  reports: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Report',
    },
  ],
});

export default mongoose.model<User>('User', UserSchema);
