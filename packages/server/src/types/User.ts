import { Document, Schema } from 'mongoose';
interface User extends Document {
  username: string;
  password: string;
  email: string;
  avatar: string;
  confirmed: boolean;
  communities: Schema.Types.ObjectId[];
  banned: Schema.Types.ObjectId[];
  karma: number;
  date: string;
  savedPosts: string[];
  savedComments: string[];
  confirm: () => void;
}
export default User;
