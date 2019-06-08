import express from 'express';
import { body } from 'express-validator/check';
import User from '../models/User';

import { login, signUp, confirm } from '../controllers/user';
const router = express.Router();

router.post(
  '/users',
  [
    body(
      'username',
      'Please choose another username. It should be at least 4 characters long.',
    )
      .isLength({ min: 4 })
      .isString()
      .trim()
      .custom(
        (username: string, { req }): Promise<void> => {
          return User.findOne({ username }).then(userDoc => {
            if (userDoc) {
              return Promise.reject(
                'Another user with this username already exists.',
              );
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
              return Promise.reject(
                'Another user with this email already exists.',
              );
            }
            return Promise.resolve();
          });
        },
      ),
    body('password', 'Your password should be at least 12 characters long.')
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
    body('email', 'Please enter valid email!')
      .isEmail()
      .custom(
        (email, { req }): Promise<void> => {
          return User.findOne({ email }).then(userDoc => {
            if (userDoc) {
              return Promise.reject(
                'Email is already used,please user another one',
              );
            }
            return Promise.resolve();
          });
        },
      ),
    body('password', 'Your password should be at least 12 characters long.')
      .isLength({ min: 12 })
      .isAlphanumeric()
      .trim()
      .escape(),
  ],
  login,
);

router.patch('/users/:token', confirm);
export default router;
