import { ErrorREST, Errors } from '../classes/ErrorREST';
import ValidationError from '../types/ValidationError';
const checkLimit = (limit: number): void => {
  try {
    if (limit > 50 || limit < 1) {
      const errorData: ValidationError = {
        location: 'query',
        param: '',
        msg: 'Limit must be between 0 and 50. Default is 25.',
        value: '',
      };
      const { status, message } = Errors.BadRequest;
      const error = new ErrorREST(status, message, errorData);
      throw error;
    }
  } catch (err) {
    throw err;
  }
};
export default checkLimit;
