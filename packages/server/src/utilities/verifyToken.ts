import jwt from 'jsonwebtoken';
import { ErrorREST, Errors } from '../classes/ErrorREST';
const verifyToken = (token: string) => {
  const secret: any = process.env.SECRET;
  const { userId }: any = jwt.verify(
    token,
    secret,
    (err: any, decoded: any) => {
      if (err) {
        const { status, message } = Errors.Unauthorized;
        const error = new ErrorREST(status, message, null);
        throw error;
      } else {
        return decoded;
      }
    },
  );
  return userId;
};
export default verifyToken;
