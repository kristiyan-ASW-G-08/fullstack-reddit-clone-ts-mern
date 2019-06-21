import Ban from './Ban';
import User from './User';
import Rule from './Rule';
interface PopulatedBan extends Ban {
  user: User;
  bannedUser: User;
  rule: Rule | undefined;
}
export default PopulatedBan;
