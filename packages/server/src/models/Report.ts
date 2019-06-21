import Report from '../types/Report';
import mongoose, { Schema } from 'mongoose';
const ReportSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'User',
  },
  reportedUser: {
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
    refPath: 'Rule',
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
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<Report>('Report', ReportSchema);
