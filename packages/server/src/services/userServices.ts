import User from '../models/User';
import UserType from '../types/User';
import ValidationError from '../types/ValidationError';
import { ErrorREST, Errors } from '../classes/ErrorREST';
import bcrypt from 'bcryptjs';
import comparePasswords from '../utilities/comparePasswords';
import checkUserConfirmation from '../utilities/checkUserConfirmation';
import signLoginToken from '../utilities/signLoginToken';
import verifyToken from '../utilities/verifyToken';
import removeFromArr from '../utilities/removeFromArr';
import includesObjectId from '../utilities/includesObjectId';
import Comment from '../types/Comment';
import Post from '../types/Post';
const createUser = async (
  email: string,
  username: string,
  password: string,
): Promise<string> => {
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      username,
    });
    const userId = user._id.toString();
    await user.save();
    return userId;
  } catch (err) {
    throw err;
  }
};

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
const confirmUser = async (token: string): Promise<void> => {
  try {
    const userId = verifyToken(token);
    const user = await getUserById(userId);
    user.confirmed = true;
    await user.save();
  } catch (err) {
    throw err;
  }
};

const upvotePost = async (
  user: UserType,
  postId: string,
  post: Post,
): Promise<void> => {
  try {
    if (includesObjectId(user.upvotedPosts, postId)) {
      user.upvotedPosts = removeFromArr(user.upvotedPosts, postId);
      post.upvotes--;
    } else if (includesObjectId(user.downvotedPosts, postId)) {
      user.downvotedPosts = removeFromArr(user.downvotedPosts, postId);
      user.upvotedPosts.push(postId);
      post.downvotes--;
      post.upvotes++;
    } else {
      user.upvotedPosts.push(postId);
      post.upvotes++;
    }
    await post.save();
    await user.save();
  } catch (err) {
    throw err;
  }
};

const downvotePost = async (
  user: UserType,
  postId: string,
  post: Post,
): Promise<void> => {
  try {
    if (includesObjectId(user.downvotedPosts, postId)) {
      user.downvotedPosts = removeFromArr(user.downvotedPosts, postId);
      post.downvotes--;
    } else if (includesObjectId(user.upvotedPosts, postId)) {
      user.upvotedPosts = removeFromArr(user.upvotedPosts, postId);
      user.downvotedPosts.push(postId);
      post.upvotes--;
      post.downvotes++;
    } else {
      user.downvotedPosts.push(postId);
      post.downvotes++;
    }
    await post.save();
    await user.save();
  } catch (err) {
    throw err;
  }
};

const upvoteComment = async (
  user: UserType,
  commentId: string,
  comment: Comment,
): Promise<void> => {
  try {
    if (includesObjectId(user.upvotedComments, commentId)) {
      user.upvotedComments = removeFromArr(user.upvotedComments, commentId);
      comment.upvotes--;
    } else if (includesObjectId(user.downvotedComments, commentId)) {
      user.downvotedComments = removeFromArr(user.downvotedComments, commentId);
      user.upvotedComments.push(commentId);
      comment.downvotes--;
      comment.upvotes++;
    } else {
      user.upvotedComments.push(commentId);
      comment.upvotes++;
    }
    await comment.save();
    await user.save();
  } catch (err) {
    throw err;
  }
};
const downvoteComment = async (
  user: UserType,
  commentId: string,
  comment: Comment,
): Promise<void> => {
  try {
    if (includesObjectId(user.downvotedComments, commentId)) {
      user.downvotedComments = removeFromArr(user.downvotedComments, commentId);
      comment.downvotes--;
    } else if (includesObjectId(user.upvotedComments, commentId)) {
      user.upvotedComments = removeFromArr(user.upvotedComments, commentId);
      user.downvotedComments.push(commentId);
      comment.upvotes--;
      comment.downvotes++;
    } else {
      user.downvotedComments.push(commentId);
      comment.downvotes++;
    }
    await comment.save();
    await user.save();
  } catch (err) {
    throw err;
  }
};

const subscribe = async (
  user: UserType,
  communityId: string,
): Promise<void> => {
  try {
    if (includesObjectId(user.communities, communityId)) {
      user.communities = removeFromArr(user.communities, communityId);
    } else {
      user.communities.push(communityId);
    }
    await user.save();
  } catch (err) {
    throw err;
  }
};
export {
  upvotePost,
  downvotePost,
  upvoteComment,
  downvoteComment,
  createUser,
  getUserByEmail,
  getUserById,
  authenticateUser,
  confirmUser,
  subscribe,
};
