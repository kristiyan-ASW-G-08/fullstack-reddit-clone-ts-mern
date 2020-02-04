import bcrypt from 'bcryptjs';
import { ErrorREST, Errors } from './ErrorREST';
import ValidationError from '@rddt/common/types/ValidationError';
const comparePasswords = async (
  password: string,
  userPassword: string,
): Promise<void> => {
  try {
    const passwordMatch = await bcrypt.compare(password, userPassword);
    if (!passwordMatch) {
      const errorData: ValidationError[] = [
        {
          location: 'body',
          param: 'password',
          msg: 'Password does not match!',
          value: password,
        },
      ];
      const { status, message } = Errors.Unauthorized;
      const error = new ErrorREST(status, message, errorData);
      throw error;
    }
  } catch (err) {
    throw err;
  }
};
export default comparePasswords;
