import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import RESTError, { errors } from '@utilities/RESTError';

const authenticationHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { SECRET } = process.env;
  const authHeader = req.get('Authorization');
  const { status, message } = errors.Unauthorized;
  const error = new RESTError(status, message);
  if (!authHeader) {
    throw error;
  }
  const token = authHeader.split(' ')[1];
  // @ts-ignore
  const { userId } = verify(token, SECRET);
  if (!userId) {
    throw error;
  }
  req.userId = userId;
  next();
};
export default authenticationHandler;
