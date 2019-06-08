import mongoose, { Schema } from 'mongoose';
import Vote from '../types/Vote';
const VoteSchema: Schema = new Schema({
  user: Schema.Types.ObjectId,
  voteType: {
    type: String,
    required: true,
    enum: ['upvote', 'downvote'],
  },
  modelType: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'onModel',
  },
  onModel: {
    type: String,
    required: true,
    enum: ['Post', 'Comment'],
  },
});
export default mongoose.model<Vote>('Vote', VoteSchema);
