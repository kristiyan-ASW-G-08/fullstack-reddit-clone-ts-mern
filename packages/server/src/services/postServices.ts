import Post from '../models/Post';
import PostType from '../types/Post';
import { ErrorREST, Errors } from '../classes/ErrorREST';
import isAuthorized from '../utilities/isAuthorized';
import ValidationError from '../types/ValidationError';
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
        const errorData: ValidationError = {
          location: 'body',
          param: 'image',
          msg: 'Submit an image.',
          value: 'image',
        };
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
  let posts: PostType[];
  switch (sort) {
    case 'top':
      posts = await Post.countDocuments()
        .find()
        .sort('-upvotes')
        .skip((page - 1) * limit)
        .limit(limit);
      break;
    case 'new':
      posts = await Post.find()
        .countDocuments()
        .find()
        .sort('-date')
        .skip((page - 1) * limit)
        .limit(limit);
      break;
    case 'comments':
      posts = await Post.countDocuments()
        .find()
        .sort('-comments')
        .skip((page - 1) * limit)
        .limit(limit);
      break;
    default:
      posts = await Post.countDocuments()
        .find()
        .sort('-upvotes')
        .skip((page - 1) * limit)
        .limit(limit);
      break;
  }
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
  let posts: PostType[];
  switch (sort) {
    case 'top':
      posts = await Post.countDocuments()
        .find({ community: communityId })
        .sort('-upvotes')
        .skip((page - 1) * limit)
        .limit(limit);
      break;
    case 'new':
      posts = await Post.find()
        .countDocuments()
        .find({ community: communityId })
        .sort('-date')
        .skip((page - 1) * limit)
        .limit(limit);
      break;
    case 'comments':
      posts = await Post.countDocuments()
        .find({ community: communityId })
        .sort('-comments')
        .skip((page - 1) * limit)
        .limit(limit);
      break;
    default:
      posts = await Post.find()
        .countDocuments()
        .find({ community: communityId })
        .sort('-upvotes')
        .skip((page - 1) * limit)
        .limit(limit);
      break;
  }
  if (posts.length < 1) {
    const { status, message } = Errors.NotFound;
    const error = new ErrorREST(status, message);
    throw error;
  }
  const postsCount = (await Post.countDocuments()) - page * limit;
  console.log(posts);
  return { posts, postsCount };
};
export {
  createPost,
  getPostById,
  getPostContent,
  editPost,
  getPosts,
  getPostsByCommunityId,
};
