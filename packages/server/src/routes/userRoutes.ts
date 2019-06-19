import express from 'express';
import { body } from 'express-validator/check';
import User from '../models/User';
import isAuth from '../middleware/isAuth';
import {
  login,
  signUp,
  confirm,
  savePost,
  saveComment,
} from '../controllers/usersController';
const router = express.Router();

router.post(
  '/users',
  [
    body('username', 'Username should be at least 4  characters long.')
      .isLength({ min: 4 })
      .isString()
      .trim()
      .custom(
        (username: string, { req }): Promise<void> => {
          return User.findOne({ username }).then(userDoc => {
            if (userDoc) {
              return Promise.reject('Username is already taken.');
            }
            return Promise.resolve();
          });
        },
      ),
    body('email', 'Enter a valid email address.')
      .isEmail()
      .custom(
        (email, { req }): Promise<void> => {
          return User.findOne({ email }).then(userDoc => {
            if (userDoc) {
              return Promise.reject('User with this email already exists.');
            }
            return Promise.resolve();
          });
        },
      ),
    body('password', 'Password should be at least 12 characters long.')
      .isLength({ min: 12 })
      .isAlphanumeric()
      .trim()
      .escape(),
    body('matchPassword')
      .trim()
      .isLength({ min: 12 })
      .isAlphanumeric()
      .escape()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match.');
        }
        return true;
      }),
  ],
  signUp,
);

router.post(
  '/users/token',
  [
    body('email', 'Enter a valid email address.')
      .isEmail()
      .custom(
        (email, { req }): Promise<void> => {
          return User.findOne({ email }).then(userDoc => {
            if (userDoc) {
              return Promise.reject('Email is already taken.');
            }
            return Promise.resolve();
          });
        },
      ),
    body('password', 'Password should be at least 12 characters long.')
      .isLength({ min: 12 })
      .isAlphanumeric()
      .trim()
      .escape(),
  ],
  login,
);

router.patch('/users/:token', confirm);
router.patch('/users/posts/:postId', isAuth, savePost);
router.patch('/users/comments/:commentId', isAuth, saveComment);

export default router;
