interface Post {
  type: string;
  title: string;
  text?: string;
  link?: string;
  image?: string;
  user: string;
  community: string;
  date: string;
  upvotes: number;
  downvotes: number;
  _id: string;
}
export default Post;
