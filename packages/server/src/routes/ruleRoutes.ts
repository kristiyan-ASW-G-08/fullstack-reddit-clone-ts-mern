import express from 'express';
import { body } from 'express-validator/check';
import isAuth from '../middleware/isAuth';
import { postRule, putRule, deleteRule } from '../controllers/rule';
const router = express.Router();
const ruleValidationArr = [
  body('name', 'Name should be between 1 and 100 characters long.')
    .isLength({ min: 1, max: 100 })
    .isString()
    .trim(),
  body(
    'description',
    'Description should be at between 20 and 100 characters long.',
  )
    .isLength({ min: 1, max: 100 })
    .isString()
    .trim(),
  body('scope')
    .isString()
    .trim(),
];
router.post(
  '/communities/:communityId/rules',
  ruleValidationArr,
  isAuth,
  postRule,
);

router.put('/communities/rules/:ruleId', ruleValidationArr, isAuth, putRule);
router.delete('/communities/rules/:ruleId', isAuth, deleteRule);
export default router;
