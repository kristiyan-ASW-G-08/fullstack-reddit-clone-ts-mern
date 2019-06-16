import Post from '../types/Post';
import mongoose, { Schema } from 'mongoose';
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
  upvote: { type: Number, default: 0 },
  downvote: { type: Number, default: 0 },
});

export default mongoose.model<Post>('Post', PostSchema);
