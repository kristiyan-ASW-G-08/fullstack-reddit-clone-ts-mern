import mongoose, { Schema } from 'mongoose';
import User from '../types/User';
const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmed: { type: Boolean, default: false },
  avatar: { type: String, default: '/avatar.svg' },
  communities: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Community',
    },
  ],
  banned: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Community',
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  karma: {
    type: Number,
    default: 0,
  },
});
UserSchema.methods.confirm = function(): void {
  this.confirmed = true;
  this.save();
};
export default mongoose.model<User>('User', UserSchema);
