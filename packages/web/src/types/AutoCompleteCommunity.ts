import Theme from '@rddt/common/types/Theme';
interface AutoCompleteCommunityData {
  name: string;
  subscribers: number;
  score: number;
  theme: Theme;
  _id: string;
}
interface AutoCompleteCommunityLinks {
  self: string;
}

export default interface AutoCompleteCommunity {
  data: AutoCompleteCommunityData;
  links: AutoCompleteCommunityLinks;
}
