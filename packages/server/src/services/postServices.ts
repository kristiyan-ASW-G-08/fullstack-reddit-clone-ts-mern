import Post from '../models/Post';
import PostType from '../types/Post';
import { ErrorREST, Errors } from '../classes/ErrorREST';
import isAuthorized from '../utilities/isAuthorized';
import ValidationError from '@rddt/common/types/ValidationError';
import { Request } from 'express';
const createPost = async (
  type: string,
  title: string,
  content: string,
  communityId: string,
  userId: string,
): Promise<string> => {
  try {
    let post: PostType;
    switch (type) {
      case 'text':
        post = new Post({
          type,
          title,
          text: content,
          community: communityId,
          user: userId,
        });
        break;
      case 'link':
        post = new Post({
          type,
          title,
          linkUrl: content,
          community: communityId,
          user: userId,
        });
        break;
      case 'image':
        post = new Post({
          type,
          title,
          image: content,
          community: communityId,
          user: userId,
        });
        break;
      default:
        post = new Post({
          type,
          title,
          text: content,
          community: communityId,
          user: userId,
        });
    }
    const postId = post._id.toString();
    await post.save();
    return postId;
  } catch (err) {
    throw err;
  }
};

const getPostById = async (postId: string): Promise<PostType> => {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const { status, message } = Errors.NotFound;
      const error = new ErrorREST(status, message, {});
      throw error;
    }
    return post;
  } catch (err) {
    throw err;
  }
};
const getPostContent = (type: string, req: Request): string => {
  let content: string;
  switch (type) {
    case 'text':
      content = req.body.text;
      break;
    case 'link':
      content = req.body.linkUrl;
      break;
    case 'image':
      if (!req.file) {
        const errorData: ValidationError[] = [
          {
            location: 'body',
            param: 'image',
            msg: 'Submit an image.',
            value: 'image',
          },
        ];
        const { status, message } = Errors.BadRequest;
        const error = new ErrorREST(status, message, errorData);
        throw error;
      }
      content = req.file.path;
    default:
      content = req.body.text;
  }
  return content;
};

const editPost = async (
  post: PostType,
  userId: string,
  title: string,
  content: string,
): Promise<void> => {
  try {
    isAuthorized(post.user, userId);
    post.title = title;
    switch (post.type) {
      case 'text':
        post.text = content;
        break;
      case 'link':
        post.linkUrl = content;
        break;
      case 'image':
        post.image = content;
      default:
        post.text = content;
    }
    await post.save();
  } catch (err) {
    throw err;
  }
};
interface GetPostsResponse {
  posts: PostType[];
  postsCount: number;
}
const getPosts = async (
  sort: string,
  limit: number,
  page: number,
): Promise<GetPostsResponse> => {
  let sortString: string;
  switch (sort) {
    case 'top':
      sortString = '-upvotes';
      break;
    case 'new':
      sortString = '-date';
      break;
    case 'comments':
      sortString = '-comments';
      break;
    default:
      sortString = '-upvotes';
      break;
  }
  const posts = await Post.countDocuments()
    .find()
    .sort(sortString)
    .skip((page - 1) * limit)
    .limit(limit);
  if (posts.length < 1) {
    const { status, message } = Errors.NotFound;
    const error = new ErrorREST(status, message);
    throw error;
  }
  const postsCount = (await Post.countDocuments()) - page * limit;
  return { posts, postsCount };
};
const getPostsByCommunityId = async (
  communityId: string,
  sort: string,
  limit: number,
  page: number,
): Promise<GetPostsResponse> => {
  let sortString: string;
  switch (sort) {
    case 'top':
      sortString = '-upvotes';
      break;
    case 'new':
      sortString = '-date';
      break;
    case 'comments':
      sortString = '-comments';
      break;
    default:
      sortString = '-upvotes';
      break;
  }
  const posts = await Post.find()
    .countDocuments()
    .find({ community: communityId })
    .sort(sortString)
    .skip((page - 1) * limit)
    .limit(limit);
  if (posts.length < 1) {
    const { status, message } = Errors.NotFound;
    const error = new ErrorREST(status, message);
    throw error;
  }
  const postsCount = (await Post.countDocuments()) - page * limit;
  return { posts, postsCount };
};

const getPostsByUserSubscriptions = async (
  subscriptions: string[],
  sort: string,
  limit: number,
  page: number,
): Promise<GetPostsResponse> => {
  let sortString: string;
  switch (sort) {
    case 'top':
      sortString = '-upvotes';
      break;
    case 'new':
      sortString = '-date';
      break;
    case 'comments':
      sortString = '-comments';
      break;
    default:
      sortString = '-upvotes';
      break;
  }
  const posts = await Post.find()
    .countDocuments()
    .find({ community: { $in: subscriptions } })
    .sort(sortString)
    .skip((page - 1) * limit)
    .limit(limit);
  if (posts.length < 1) {
    const { status, message } = Errors.NotFound;
    const error = new ErrorREST(status, message);
    throw error;
  }
  const postsCount = (await Post.countDocuments()) - page * limit;
  return { posts, postsCount };
};
const toggleHiddenPosts = async (
  userId: string,
  hidden: boolean,
  communityId?: string,
): Promise<void> => {
  try {
    let updateOptions: any = { user: userId };
    if (communityId) {
      updateOptions = { user: userId, community: communityId };
    }
    await Post.updateMany(updateOptions, { $set: { hidden } });
  } catch (err) {
    throw err;
  }
};
export {
  createPost,
  getPostById,
  getPostContent,
  editPost,
  getPosts,
  getPostsByCommunityId,
  getPostsByUserSubscriptions,
  toggleHiddenPosts,
};
