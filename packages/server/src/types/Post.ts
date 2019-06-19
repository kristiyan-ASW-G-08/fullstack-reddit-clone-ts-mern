import Post from '@rddt/common/types/Post';
import { Document } from 'mongoose';
interface ExtendedPost extends Post {
  user: string;
  community: string;
}
type PostType = ExtendedPost & Document;
export default PostType;
