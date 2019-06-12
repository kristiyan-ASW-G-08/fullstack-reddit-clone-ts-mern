import express from 'express';
import { body } from 'express-validator/check';
import Community from '../models/Community';
import isAuth from '../middleware/isAuth';
import {
  postCommunity,
  patchCommunity,
  patchCommunityTheme,
} from '../controllers/community';
const router = express.Router();

router.post(
  '/communities',
  [
    body('name', 'Name should be at least 4 characters long.')
      .isLength({ min: 4 })
      .isString()
      .trim()
      .custom(
        (name: string, { req }): Promise<void> => {
          return Community.findOne({ name }).then(CommunityDoc => {
            if (CommunityDoc) {
              return Promise.reject(
                'Another user with this username already exists.',
              );
            }
            return Promise.resolve();
          });
        },
      ),
    body(
      'description',
      'Description should be at between 20 and 40 characters long.',
    )
      .isLength({ min: 20, max: 40 })
      .isString()
      .trim(),
  ],
  isAuth,
  postCommunity,
);

router.patch('/communities/:communityId', isAuth, patchCommunity);
router.patch('/communities/:communityId/themes', isAuth, patchCommunityTheme);
export default router;
