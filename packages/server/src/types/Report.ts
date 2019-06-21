import Report from '@rddt/common/types/Report';
import { Document } from 'mongoose';
interface ExtendedReport extends Report {
  user: string;
  source: string;
  reportedUser: string;
  rule: string | undefined;
}
type ReportType = ExtendedReport & Document;
export default ReportType;
