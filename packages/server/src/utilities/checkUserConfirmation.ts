import { ErrorREST, Errors } from './ErrorREST';
import ValidationError from '@rddt/common/types/ValidationError';
import UserType from '../types/User';
const checkUserConfirmation = async (user: UserType): Promise<void> => {
  try {
    if (!user.confirmed) {
      const errorData: ValidationError = {
        location: 'body',
        param: '',
        msg: 'Confirm your email to login.',
        value: '',
      };
      const { status, message } = Errors.Unauthorized;
      const error = new ErrorREST(status, message, errorData);
      throw error;
    }
  } catch (err) {
    throw err;
  }
};
export default checkUserConfirmation;
