import mongoose, { Document } from 'mongoose';
interface User extends Document {
  username: string;
  password: string;
  email: string;
  avatar: string;
  confirmed: boolean;
  communities: string[];
  bans: string[];
  karma: number;
  date: string;
  upvotedPosts: mongoose.Types.ObjectId[];
  downvotedPosts: mongoose.Types.ObjectId[];
  upvotedComments: mongoose.Types.ObjectId[];
  downvotedComments: mongoose.Types.ObjectId[];
  savedPosts: mongoose.Types.ObjectId[];
  savedComments: mongoose.Types.ObjectId[];
  reports: mongoose.Types.ObjectId[];
}
export default User;
