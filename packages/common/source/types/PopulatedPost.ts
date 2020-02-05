import Post from './Post';
import User from './User';
import Community from './Community';
interface PopulatedPost extends Post {
  user: User;
  community: Community;
}
export default PopulatedPost;
