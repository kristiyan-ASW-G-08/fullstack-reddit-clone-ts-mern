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
          link: content,
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
      content = req.body.link;
      break;
    case 'image':
      if (!req.file) {
        const errorData: ValidationError = {
          location: 'body',
          param: 'image',
          msg: 'User with this email does not exist!',
          value: 'image',
        };
        const { status, message } = Errors.BadRequest;
        const error = new ErrorREST(status, message, {});
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
        post.link = content;
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
const deletePostById = async (
  postId: string,
  userId: string,
): Promise<void> => {
  try {
    const post = await getPostById(postId);
    isAuthorized(post.user, userId);
    post.remove();
    await post.save();
  } catch (err) {
    throw err;
  }
};
export { createPost, getPostById, deletePostById, getPostContent, editPost };
