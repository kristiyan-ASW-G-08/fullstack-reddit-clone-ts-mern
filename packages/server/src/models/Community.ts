import Community from '../types/Community';
import mongoose, { Schema } from 'mongoose';
const CommunitySchema: Schema = new Schema({
  name: { type: String, required: true, min: 4, max: 40 },
  description: { type: String, required: true, min: 20, max: 100 },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subscribers: {
    type: Number,
    default: 0,
  },
  theme: {
    icon: { type: String, default: '/assets/default/icon.svg' },
    colors: {
      base: { type: String, default: '#1890ff' },
      highlight: { type: String, default: '#1890ff' },
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
CommunitySchema.index({ name: 'text' });

export default mongoose.model<Community>('Community', CommunitySchema);
