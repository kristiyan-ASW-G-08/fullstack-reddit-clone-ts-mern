interface Post {
  type: string;
  title: string;
  text?: string;
  linkUrl?: string;
  image?: string;
  user: string;
  community: string;
  date: string;
  comments:number;
  upvotes: number;
  downvotes: number;
  _id: string;
}
export default Post;
