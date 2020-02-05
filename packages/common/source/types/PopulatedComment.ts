import Comment from './Comment';
import User from './User';
interface PopulatedComment extends Comment {
  user: User;
}
export default PopulatedComment;
