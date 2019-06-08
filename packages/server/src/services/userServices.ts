import User from '../models/User';
import UserType from '../types/User';
import ValidationError from '../types/ValidationError';
import { ErrorREST, Errors } from '../classes/ErrorREST';
import bcrypt from 'bcryptjs';
import comparePasswords from '../utilities/comparePasswords';
import checkUserConfirmation from '../utilities/checkUserConfirmation';
import signLoginToken from '../utilities/signLoginToken';
import verifyToken from '../utilities/verifyToken';
interface CreateUserResponse {
  userId: string;
}
const createUser = async (
  email: string,
  username: string,
  password: string,
): Promise<CreateUserResponse> => {
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      username,
    });
    const userId = user._id.toString();
    await user.save();
    return { userId };
  } catch (err) {
    throw err;
  }
};
export default createUser;

const getUserByEmail = async (email: string): Promise<UserType> => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const errorData: ValidationError = {
        location: 'body',
        param: 'email',
        msg: 'User with this email does not exist!',
        value: email,
      };
      const { status, message } = Errors.NotFound;
      const error = new ErrorREST(status, message, errorData);
      throw error;
    }
    return user;
  } catch (err) {
    throw err;
  }
};

const getUserById = async (userId: string): Promise<UserType> => {
  try {
    console.log(userId);
    const user = await User.findById(userId);
    if (!user) {
      const errorData: ValidationError = {
        location: 'body',
        param: '',
        msg: 'User not found!',
        value: '',
      };
      const { status, message } = Errors.NotFound;
      const error = new ErrorREST(status, message, errorData);
      throw error;
    }
    return user;
  } catch (err) {
    throw err;
  }
};
const authenticateUser = async (
  user: UserType,
  password: string,
): Promise<any> => {
  try {
    await comparePasswords(password, user.password);
    await checkUserConfirmation(user);
    const token = signLoginToken(user);
    const { email, username, _id } = user;
    const userData = {
      email,
      username,
      userId: _id.toString(),
    };
    return { token, userData };
  } catch (err) {
    throw err;
  }
};
const confirmUser = async (token: string): Promise<any> => {
  try {
    const userId = verifyToken(token);
    const user = await getUserById(userId);
    await user.confirm();
  } catch (err) {
    throw err;
  }
};
export {
  createUser,
  getUserByEmail,
  getUserById,
  authenticateUser,
  confirmUser,
};
