import { Request, Response, NextFunction } from 'express';
import { ErrorREST, Errors } from '../classes/ErrorREST';
const passErrorToNext = (err: any, next: NextFunction): void => {
  console.log(err);
  let error = err;
  if (!err.status) {
    const { status, message } = Errors.InternalServerError;
    error = new ErrorREST(status, message);
  }
  next(error);
};
export default passErrorToNext;
