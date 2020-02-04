import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ErrorREST, Errors } from '../utilities/ErrorREST';
const secret: any = process.env.SECRET;
const isAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.get('Authorization');
  const { status, message } = Errors.Unauthorized;
  const error = new ErrorREST(status, message, null);
  console.log(authHeader);
  if (!authHeader) {
    throw error;
  }
  const token = authHeader.split(' ')[1];

  let decodedToken: any;
  try {
    decodedToken = verify(token, secret);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
export default isAuth;
