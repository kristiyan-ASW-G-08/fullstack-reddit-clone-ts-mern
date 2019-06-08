import { Document, Schema } from 'mongoose';
interface Vote extends Document {
  user: Schema.Types.ObjectId;
  voteType: string;
  modelType: Schema.Types.ObjectId;
  onModel: string;
}
export default Vote;
