import jwt from 'jsonwebtoken';
import UserType from '../types/User';
const signLoginToken = (user: UserType): any => {
  const secret: any = process.env.SECRET;
  const token = jwt.sign(
    {
      email: user.email,
      userId: user._id.toString(),
    },
    secret,
    { expiresIn: '1h' },
  );
  return token;
};
export default signLoginToken;
