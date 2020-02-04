import { NextFunction } from 'express';
import { ErrorREST, Errors } from './ErrorREST';
const passErrorToNext = (err: any, next: NextFunction): void => {
  let error = err;
  if (!err.status) {
    const { status, message } = Errors.InternalServerError;
    error = new ErrorREST(status, message, err);
  }
  next(error);
};
export default passErrorToNext;
