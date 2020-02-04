import express from 'express';
import { body, query } from 'express-validator/check';
import isAuth from '../middleware/isAuth';
import {
  reportPost,
  reportComment,
  deleteReport,
  getReports,
} from './reportsController';
const router = express.Router();
const reportValidation = [
  body('reason', 'Reason is not valid.')
    .isString()
    .trim()
    .matches(
      /(It breaks a rule|It infringes my copyright|It infringes my trademark rights|It's personal and confidential information|It's sexual or suggestive content involving minors|It's involuntary pornography|It's a transaction for prohibited goods or services|It's threatening self-harm or suicide)/,
    ),
  body('reportedUserId')
    .isString()
    .trim(),
  body('ruleId')
    .optional()
    .isString()
    .trim(),
];
const reportDeleteQueries = [
  query('type')
    .isAlpha()
    .trim()
    .matches(/(approved| dismissed)/),
];
router.post(
  '/communities/:communityId/posts/:postId/reports',
  reportValidation,
  isAuth,
  reportPost,
);
router.post(
  '/communities/:communityId/comments/:commentId/reports',
  reportValidation,
  isAuth,
  reportComment,
);

router.delete(
  '/communities/:communityId/reports/:reportId',
  reportDeleteQueries,
  isAuth,
  deleteReport,
);
router.get(
  '/communities/:communityId/reports',
  reportDeleteQueries,
  isAuth,
  getReports,
);
export default router;
