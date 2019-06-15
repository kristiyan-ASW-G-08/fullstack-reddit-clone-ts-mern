import express from 'express';
import { body } from 'express-validator/check';
import isAuth from '../middleware/isAuth';
import { postPost, putPost, deletePost } from '../controllers/post';
const router = express.Router();
const postValidation = [
  body('title', 'Title should be between 1 and 100 characters long.')
    .isLength({ min: 1, max: 100 })
    .isString()
    .trim(),
  body('text', 'Text should be at between 1 and 10000 characters long.')
    .isLength({ min: 1, max: 10000 })
    .isString()
    .trim()
    .optional(),
  body('link')
    .isLength({ min: 1, max: 2100 })
    .isString()
    .trim(),
];
router.post('/posts', postValidation, isAuth, postPost);
router.patch('/posts/:postId', postValidation, isAuth, patchPost);
router.delete('/posts/:postId', isAuth, deletePost);
export default router;