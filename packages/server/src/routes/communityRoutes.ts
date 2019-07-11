import express from 'express';
import { body } from 'express-validator/check';
import Community from '../models/Community';
import isAuth from '../middleware/isAuth';
import {
  postCommunity,
  patchCommunity,
  patchCommunityThemeIcon,
  patchCommunityThemeColors,
  getCommunity,
  getCommunityNames,
} from '../controllers/communitiesController';
const router = express.Router();

router.post(
  '/communities',
  [
    body('name', 'Name should be at least 4 characters long.')
      .isLength({ min: 4, max: 40 })
      .isString()
      .trim()
      .custom(
        (name: string, { req }): Promise<void> => {
          return Community.findOne({ name }).then(CommunityDoc => {
            if (CommunityDoc) {
              return Promise.reject('Name is already taken.');
            }
            return Promise.resolve();
          });
        },
      ),
    body(
      'description',
      'Description should be at between 20 and 100 characters long.',
    )
      .isLength({ min: 20, max: 100 })
      .isString()
      .trim(),
  ],
  isAuth,
  postCommunity,
);

router.patch('/communities/:communityId', isAuth, patchCommunity);
router.patch(
  '/communities/:communityId/themes/colors',
  isAuth,
  [
    body('base')
      .isHexColor()
      .isString()
      .trim(),
    body('highlight')
      .isHexColor()
      .isString()
      .trim(),
  ],
  isAuth,
  patchCommunityThemeColors,
);
router.patch(
  '/communities/:communityId/themes/icons',
  isAuth,
  isAuth,
  patchCommunityThemeIcon,
);
router.get('/communities/:communityId', getCommunity);
router.get('/communities/:searchTerm/names', getCommunityNames);
export default router;
