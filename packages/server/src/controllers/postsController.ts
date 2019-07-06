import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator/check';
import isEmpty from '../utilities/isEmpty';
import passErrorToNext from '../utilities/passErrorToNext';
import deleteFile from '../utilities/deleteFile';
import isAuthorized from '../utilities/isAuthorized';
import checkLimit from '../utilities/checkLimit';
import {
  createPost,
  editPost,
  getPostContent,
  getPostById,
  getPosts,
  getPostsByCommunityId,
  getPostsByUserSubscriptions,
} from '../services/postServices';
import { getUserById, isBanned } from '../services/userServices';
export const postPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    isEmpty(validationResult(req));
    const { communityId } = req.params;
    const { userId } = req;
    const { title, type } = req.body;
    const user = await getUserById(userId);
    isBanned(user.bans, communityId);
    const content = getPostContent(type, req);
    const post = await createPost(type, title, content, communityId, userId);
    res.status(200).json({
      data: { post },
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
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};
export const getPostsFromAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const sort = req.query.sort || 'top';
    const limit = parseInt(req.query.limit) || 25;
    const page = parseInt(req.query.page) || 1;
    checkLimit(limit);
    const { posts, postsCount } = await getPosts(sort, limit, page);
    res.status(200).json({
      data: {
        posts,
        postsCount,
      },
    });
  } catch (err) {
    passErrorToNext(err, next);
  }
};
export const getPostsByCommunity = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { communityId } = req.params;
    const sort = req.query.sort || 'top';
    const limit = parseInt(req.query.limit) || 25;
    const page = parseInt(req.query.page) || 1;
    checkLimit(limit);
    const { posts, postsCount } = await getPostsByCommunityId(
      communityId,
      sort,
      limit,
      page,
    );
    res.status(200).json({
      data: {
        posts,
        postsCount,
      },
    });
  } catch (err) {
    passErrorToNext(err, next);
  }
};
export const getSubscriptionPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req;
    const sort = req.query.sort || 'top';
    const limit = parseInt(req.query.limit) || 25;
    const page = parseInt(req.query.page) || 1;
    const user = await getUserById(userId);
    const { posts, postsCount } = await getPostsByUserSubscriptions(
      user.communities,
      sort,
      limit,
      page,
    );
    res.status(200).json({
      data: {
        posts,
        postsCount,
      },
    });
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
    const post = await getPostById(postId);
    isAuthorized(post.user, userId);
    if (post.type === 'image') {
      if (!post.image) {
        throw '';
      }
      deleteFile(post.image);
    }
    post.remove();
    await post.save();
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};
