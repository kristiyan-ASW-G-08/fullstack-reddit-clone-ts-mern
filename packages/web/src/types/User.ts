export default interface User {
  avatar: string;
  username: string;
  email: string;
  userId: string;
  savedPosts: string[];
  savedComments: string[];
  upvotedPosts: string[];
  downvotedPosts: string[];
  upvotedComments: string[];
  downvotedComments: string[];
  communities: string[];
}
