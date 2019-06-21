import Ban from '../types/Ban';
import mongoose, { Schema } from 'mongoose';
const BanSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'User',
  },
  bannedUser: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'User',
  },
  community: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'User',
  },
  reason: {
    type: String,
    required: true,
    enum: [
      'It breaks a rule',
      'It infringes my copyright',
      'It infringes my trademark rights',
      "It's personal and confidential information",
      "It's sexual or suggestive content involving minors",
      "It's involuntary pornography",
      "It's a transaction for prohibited goods or services",
      "It's threatening self-harm or suicide",
    ],
  },
  rule: {
    type: Schema.Types.ObjectId,
    refPath: 'Ban',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<Ban>('Ban', BanSchema);
