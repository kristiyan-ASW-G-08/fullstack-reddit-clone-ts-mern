import Ban from '@rddt/common/types/Ban';
import { Document } from 'mongoose';
interface ExtendedBan extends Ban {
  user: string;
  bannedUser: string;
  rule: string | undefined;
}
type BanType = ExtendedBan & Document;
export default BanType;
