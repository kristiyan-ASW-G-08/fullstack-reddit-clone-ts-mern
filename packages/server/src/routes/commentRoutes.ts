import express from 'express';
import { body, query } from 'express-validator/check';
import isAuth from '../middleware/isAuth';
import {
  postCommentFromPost,
  postCommentFromComment,
  patchComment,
  deleteComment,
  getComments,
} from '../controllers/commentsController';
const router = express.Router();
const commentValidationArr = [
  body('text', 'Text should be at between 1 and 10000 characters long.')
    .isLength({ min: 1, max: 10000 })
    .isString()
    .trim(),
];
const commentQueryValidation = [
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
  '/posts/:postId/comments',
  commentValidationArr,
  isAuth,
  postCommentFromPost,
);
router.post(
  '/comments/:commentId/comments',
  commentValidationArr,
  isAuth,
  postCommentFromComment,
);

router.patch(
  '/comments/:commentId',
  commentValidationArr,
  isAuth,
  patchComment,
);
router.delete('/comments/:commentId', isAuth, deleteComment);
router.get('/posts/:postId/comments', commentQueryValidation, getComments);
router.get(
  '/comments/:commentId/comments',
  commentQueryValidation,
  getComments,
);
export default router;
