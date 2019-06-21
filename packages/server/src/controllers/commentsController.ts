import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator/check';
import isEmpty from '../utilities/isEmpty';
import passErrorToNext from '../utilities/passErrorToNext';
import { ErrorREST, Errors } from '../classes/ErrorREST';
import checkLimit from '../utilities/checkLimit';
import {
  createComment,
  getCommentById,
  getCommentsBySourceId,
} from '../services/commentServices';
import { getUserById, isBanned } from '../services/userServices';
import isAuthorized from '../utilities/isAuthorized';
export const postCommentFromPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    isEmpty(validationResult(req));
    const { userId } = req;
    const { postId, communityId } = req.params;
    const onModel = 'Post';
    const { text } = req.body;
    const user = await getUserById(userId);
    isBanned(user.bans, communityId);
    const comment = await createComment(text, userId, postId, onModel);
    res.status(200).json({ data: { comment } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};
export const postCommentFromComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    isEmpty(validationResult(req));
    const { userId } = req;
    const { commentId, communityId } = req.params;
    const onModel = 'Comment';
    const { text } = req.body;
    const user = await getUserById(userId);
    isBanned(user.bans, communityId);
    const comment = await createComment(text, userId, commentId, onModel);
    res.status(200).json({ data: { comment } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};
export const patchComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    isEmpty(validationResult(req));
    const { text } = req.body;
    const { userId } = req;
    const { commentId } = req.params;
    const comment = await getCommentById(commentId);
    isAuthorized(comment.user, userId);
    comment.text = text;
    await comment.save();
    res.status(200).json({ data: { comment } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};
export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req;
    const { commentId } = req.params;
    const comment = await getCommentById(commentId);
    isAuthorized(comment.user, userId);
    comment.remove();
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const sort: string = req.query.sort || 'top';
    const limit = parseInt(req.query.limit) || 25;
    const page = parseInt(req.query.page) || 1;
    checkLimit(limit);
    const sourceId = req.params.postId || req.params.commentId;
    const { comments, commentsCount } = await getCommentsBySourceId(
      sourceId,
      sort,
      limit,
      page,
    );
    res.status(200).json({ data: { comments, commentsCount } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};
