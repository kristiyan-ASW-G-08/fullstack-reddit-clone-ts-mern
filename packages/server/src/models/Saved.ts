import mongoose, { Schema } from 'mongoose';
import Saved from '../types/Saved';
const SavedSchema: Schema = new Schema({
  user: Schema.Types.ObjectId,
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
export default mongoose.model<Saved>('Saved', SavedSchema);
