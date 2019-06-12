import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator/check';
import isEmpty from '../utilities/isEmpty';
import passErrorToNext from '../utilities/passErrorToNext';
import { ErrorREST, Errors } from '../classes/ErrorREST';
import {
  getCommunityById,
  editCommunityColors,
  editCommunityIcon,
} from '../services/communityServices';
import isAuthorized from '../utilities/isAuthorized';
import {
  createCommunity,
  editCommunityInfo,
} from '../services/communityServices';
export const postCommunity = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    isEmpty(validationResult(req));
    const { name, description } = req.body;
    const { userId } = req;
    console.log(req.userId, 'UserId');
    const communityId = await createCommunity(name, description, userId);
    res.status(200).json({ communityId });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const patchCommunity = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    isEmpty(validationResult(req));
    const { communityId } = req.params;
    const { name, description } = req.body;
    const { userId } = req;
    await editCommunityInfo(communityId, name, description, userId);
    res.status(200).json({ communityId });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const patchCommunityTheme = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { patchType } = req.query;
    const { communityId } = req.params;
    const { userId } = req;
    const community = await getCommunityById(communityId);
    isAuthorized(community.user.toString(), userId);
    if (patchType === 'icon') {
      if (!req.file) {
        const { status, message } = Errors.UnprocessableEntity;
        const error = new ErrorREST(status, message, {});
        throw error;
      }
      const imageUrl = req.file.path;
      editCommunityIcon(community, imageUrl);
    } else if (patchType === 'colors') {
      const { base, highlight } = req.body;
      const colors = { base, highlight };
      editCommunityColors(community, colors);
    }
    res.status(200).json({});
  } catch (err) {
    passErrorToNext(err, next);
  }
};
