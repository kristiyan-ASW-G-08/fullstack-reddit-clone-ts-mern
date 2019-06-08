import { Request, Response, NextFunction } from 'express';
import { ErrorREST, Errors } from '../classes/ErrorREST';
const passErrorToNext = (err: any, next: NextFunction): void => {
  let error = err;
  if (!err.status) {
    const { status, message } = Errors.InternalServerError;
    error = new ErrorREST(status, message, null);
  }
  next(error);
};
export default passErrorToNext;
