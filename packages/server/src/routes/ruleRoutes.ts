import express from 'express';
import { body } from 'express-validator/check';
import isAuth from '../middleware/isAuth';
import {
  postRule,
  patchRule,
  deleteRule,
  getRules,
} from '../controllers/rulesController';
const router = express.Router();
const ruleValidation = [
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
  ruleValidation,
  isAuth,
  postRule,
);

router.patch('/communities/rules/:ruleId', ruleValidation, isAuth, patchRule);
router.delete('/communities/rules/:ruleId', isAuth, deleteRule);
router.get('/communities/:communityId/rules', getRules);
export default router;
