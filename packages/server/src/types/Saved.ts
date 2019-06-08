import { Document, Schema } from 'mongoose';
interface Saved extends Document {
  user: Schema.Types.ObjectId;
  modelType: Schema.Types.ObjectId;
  onModel: string;
}
export default Saved;
