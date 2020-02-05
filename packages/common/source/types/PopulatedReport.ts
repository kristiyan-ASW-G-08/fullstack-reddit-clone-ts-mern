import Report from './Report';
import User from './User';
import Post from './Post';
import Comment from './Comment';
import Rule from './Rule';
interface PopulatedReport extends Report {
  user: User;
  source: Comment | Post;
  rule: undefined | Rule;
  reportedUser: User;
}
export default PopulatedReport;
