import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator/check';
import isEmpty from '../utilities/isEmpty';
import sendConfirmationEmail from '../services/sendConfirmationEmail';
import passErrorToNext from '../services/passErrorToNext';
import {
  createUser,
  getUserByEmail,
  authenticateUser,
  confirmUser,
} from '../services/userServices';

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    isEmpty(validationResult(req));
    const { email, username, password } = req.body;
    const { userId } = await createUser(email, username, password);
    sendConfirmationEmail(userId, email);
    res.status(200).json({ message: 'User created!' });
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
    res.status(200).json({ token, user: userData });
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
    res.status(200).json({
      confirmed: true,
    });
  } catch (err) {
    passErrorToNext(err, next);
  }
};
