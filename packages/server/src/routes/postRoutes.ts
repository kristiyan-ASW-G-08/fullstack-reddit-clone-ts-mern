import express from 'express';
import { body, query } from 'express-validator/check';
import isAuth from '../middleware/isAuth';
import {
  postPost,
  patchPost,
  deletePost,
  getPostsByCommunity,
  getPostsFromAll,
} from '../controllers/post';
const router = express.Router();
const postBodyValidation = [
  body('title', 'Title should be between 1 and 100 characters long.')
    .isLength({ min: 1, max: 100 })
    .isString()
    .trim(),
  body('text', 'Text should be at between 1 and 10000 characters long.')
    .optional()
    .isLength({ min: 1, max: 10000 })
    .isString()
    .trim(),
  body('linkUrl', 'Link should be a valid url.')
    .optional()
    .isLength({ min: 1, max: 2100 })
    .isString()
    .isURL()
    .trim(),
];
const postQueryValidation = [
  query('limit')
    .optional()
    .isNumeric()
    .isLength({ min: 1, max: 2 })
    .trim(),
  query('page')
    .optional()
    .isNumeric()
    .isLength({ min: 1 })
    .trim(),
  query('sort')
    .optional()
    .isAlpha()
    .trim()
    .matches(/(new | top | comments)/),
];
router.post(
  '/communities/:communityId/posts',
  body('type')
    .isLength({ min: 4, max: 5 })
    .isString()
    .isAlpha()
    .trim()
    .matches(/(text|image|link)/),

  postBodyValidation,
  isAuth,
  postPost,
);
router.patch('/posts/:postId', postBodyValidation, isAuth, patchPost);
router.delete('/posts/:postId', isAuth, deletePost);
router.get(
  '/communities/:communityId/posts',
  postQueryValidation,
  getPostsByCommunity,
);
router.get('/posts', postQueryValidation, getPostsFromAll);
export default router;
