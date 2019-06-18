import Comment from '../types/Comment';
import mongoose, { Schema } from 'mongoose';
const CommentSchema: Schema = new Schema({
  text: { type: String, min: 1, max: 10000 },
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
  source: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'onModel',
  },
  onModel: {
    type: String,
    required: true,
    enum: ['Post', 'Comment'],
  },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
});

export default mongoose.model<Comment>('Comment', CommentSchema);
