import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator/check';
import isEmpty from '../utilities/isEmpty';
import sendConfirmationEmail from '../utilities/sendConfirmationEmail';
import includesObjectId from '../utilities/includesObjectId';
import passErrorToNext from '../utilities/passErrorToNext';
import {
  createUser,
  getUserByEmail,
  authenticateUser,
  confirmUser,
  getUserById,
} from '../services/userServices';
import removeFromArr from '../utilities/removeFromArr';

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
    res.sendStatus(204);
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
