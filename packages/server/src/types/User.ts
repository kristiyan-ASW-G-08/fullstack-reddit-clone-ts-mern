import { Document } from 'mongoose';
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
  upvotedPosts: string[];
  downvotedPosts: string[];
  upvotedComments: string[];
  downvotedComments: string[];
  savedPosts: string[];
  savedComments: string[];
  reports: string[];
}
export default User;
