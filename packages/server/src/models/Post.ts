import Post from '../types/Post';
import mongoose, { Schema } from 'mongoose';
import { NextFunction } from 'express';
const PostSchema: Schema = new Schema({
  type: { type: String, required: true, enum: ['text', 'link', 'image'] },
  title: { type: String, required: true, min: 1, max: 300 },
  text: { type: String, min: 1, max: 10000 },
  linkUrl: { type: String, min: 3, max: 2100 },
  image: { type: String, min: 1 },
  date: {
    type: Date,
    default: Date.now,
  },
  comments: {
    type: Number,
    default: 0,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  community: {
    type: Schema.Types.ObjectId,
    ref: 'Community',
    required: true,
  },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
});
PostSchema.pre('find', function(next: NextFunction): void {
  this.populate([
    { path: 'user', select: 'username' },
    { path: 'community', select: 'name description subscribers theme' },
  ]);
  next();
});
export default mongoose.model<Post>('Post', PostSchema);
