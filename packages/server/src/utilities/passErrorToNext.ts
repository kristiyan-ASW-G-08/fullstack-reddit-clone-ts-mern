import { NextFunction } from 'express';
import RESTError, { errors } from '@utilities/RESTError';

const passErrorToNext = (err: any | RESTError, next: NextFunction): void => {
  if (err.status !== undefined) {
    next(err);
  } else {
    const { status, message } = errors.InternalServerError;
    next(new RESTError(status, message, err));
  }
};
export default passErrorToNext;
