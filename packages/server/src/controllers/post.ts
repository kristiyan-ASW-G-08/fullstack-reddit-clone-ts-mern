import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator/check';
import isEmpty from '../utilities/isEmpty';
import passErrorToNext from '../utilities/passErrorToNext';
import deleteFile from '../utilities/deleteFile';
import {
  createPost,
  editPost,
  deletePostById,
  getPostContent,
  getPostById,
} from '../services/postServices';
export const postPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    isEmpty(validationResult(req));
    const { communityId } = req.params;
    const { type } = req.query;
    const { userId } = req;
    const { title } = req.body;
    const content = getPostContent(type, req);
    const postId = await createPost(type, title, content, communityId, userId);
    const port = process.env.PORT || 8080;
    res.status(200).json({
      data: { postId },
      links: { self: `http://localhost:${port}/posts/${postId}` },
    });
  } catch (err) {
    passErrorToNext(err, next);
  }
};
export const patchPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    isEmpty(validationResult(req));
    const { postId } = req.params;
    const { userId } = req;
    const { title } = req.body;
    const post = await getPostById(postId);
    const oldImageUrl = post.image ? postId.image : '';
    const content = getPostContent(post.type, req);
    await editPost(post, userId, title, content);
    if (post.type === 'image') {
      deleteFile(oldImageUrl);
    }
    res.status(200).json();
  } catch (err) {
    passErrorToNext(err, next);
  }
};
export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req;
    const { postId } = req.params;
    await deletePostById(postId, userId);
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};
