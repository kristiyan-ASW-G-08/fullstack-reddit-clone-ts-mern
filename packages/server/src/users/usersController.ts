import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator/check';
import isEmpty from '../utilities/isEmpty';
import sendConfirmationEmail from '../utilities/sendConfirmationEmail';
import includesObjectId from '../utilities/includesId';
import passErrorToNext from '../utilities/passErrorToNext';
import removeFromArr from '../utilities/removeFromArr';
import {
  createUser,
  getUserByEmail,
  authenticateUser,
  confirmUser,
  getUserById,
  upvotePost,
  downvotePost,
  upvoteComment,
  downvoteComment,
  subscribe,
} from '../services/userServices';

import { getPostById } from '../services/postServices';
import { getCommentById } from '../services/commentServices';
export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    isEmpty(validationResult(req));
    const { email, username, password } = req.body;
    const userId = await createUser(email, username, password);
    sendConfirmationEmail(userId, email);
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    const { token, userData } = await authenticateUser(user, password);
    res.status(200).json({ data: { token, user: userData } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};
export const confirm = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { token } = req.params;
    await confirmUser(token);
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};
export const savePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { postId } = req.params;
    const { userId } = req;
    const user = await getUserById(userId);
    if (!includesObjectId(user.savedPosts, postId)) {
      user.savedPosts.push(postId);
    } else {
      user.savedPosts = removeFromArr(user.savedPosts, postId);
    }
    await user.save();
    res.status(200).json({ data: { savedPosts: user.savedPosts } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const saveComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { commentId } = req.params;
    const { userId } = req;
    const user = await getUserById(userId);
    if (!includesObjectId(user.savedPosts, commentId)) {
      user.savedPosts.push(commentId);
    } else {
      user.savedPosts = removeFromArr(user.savedPosts, commentId);
    }
    await user.save();
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const voteForPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { postId } = req.params;
    const { type } = req.query;
    const { userId } = req;
    const user = await getUserById(userId);
    const post = await getPostById(postId);
    const data: { upvotedPosts: string[]; downvotedPosts: string[] } = {
      upvotedPosts: [],
      downvotedPosts: [],
    };
    if (type === 'upvote') {
      const { upvotedPosts, downvotedPosts } = await upvotePost(
        user,
        postId,
        post,
      );
      data.upvotedPosts = upvotedPosts;
      data.downvotedPosts = downvotedPosts;
    } else if (type === 'downvote') {
      const { upvotedPosts, downvotedPosts } = await downvotePost(
        user,
        postId,
        post,
      );
      data.upvotedPosts = upvotedPosts;
      data.downvotedPosts = downvotedPosts;
    }

    res.status(200).json({ data });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const voteForComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { commentId } = req.params;
    const { type } = req.query;
    const { userId } = req;
    const user = await getUserById(userId);
    const comment = await getCommentById(commentId);
    if (type === 'upvote') {
      await upvoteComment(user, commentId, comment);
    } else if (type === 'downvote') {
      await downvoteComment(user, commentId, comment);
    }
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const subscribeToCommunity = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { communityId } = req.params;
    const { userId } = req;
    const user = await getUserById(userId);
    const communities = await subscribe(user, communityId);
    res.status(200).json({ data: { communities } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};
