import Rule from '../types/Rule';
import mongoose, { Schema } from 'mongoose';
const RuleSchema: Schema = new Schema({
  name: { type: String, required: true, min: 1, max: 100 },
  description: { type: String, required: true, min: 1, max: 100 },
  community: {
    type: Schema.Types.ObjectId,
    ref: 'Community',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  scope: {
    type: String,
    required: true,
    enum: ['Posts & comments', 'Posts only', 'Comments only'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<Rule>('Rule', RuleSchema);
