import Theme from './Theme';
interface Community {
  name: string;
  description: string;
  user: string;
  theme: Theme;
  subscribers: number;
  date: string;
}
export default Community;
