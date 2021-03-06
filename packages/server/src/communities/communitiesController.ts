import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator/check';
import isEmpty from '../utilities/isEmpty';
import ValidationError from '@rddt/common/types/ValidationError';
import passErrorToNext from '../utilities/passErrorToNext';
import { ErrorREST, Errors } from '../utilities/ErrorREST';
import {
  getCommunityById,
  editCommunityColors,
  editCommunityIcon,
  getCommunityNamesBySearchTerm,
} from '../services/communityServices';
import isAuthorized from '../utilities/isAuthorized';
import {
  createCommunity,
  editCommunityInfo,
} from '../services/communityServices';
import deleteFile from '../utilities/deleteFile';
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
    res.status(200).json({ data: { communityId } });
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

export const patchCommunityThemeIcon = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    isEmpty(validationResult(req));
    const { communityId } = req.params;
    const { userId } = req;
    const community = await getCommunityById(communityId);
    isAuthorized(community.user.toString(), userId);
    if (!req.file) {
      const errorData: ValidationError[] = [
        {
          location: 'body',
          param: 'image',
          msg: 'Submit an image.',
          value: 'image',
        },
      ];
      const { status, message } = Errors.BadRequest;
      const error = new ErrorREST(status, message, errorData);
      throw error;
    }
    const imageUrl = req.file.path;
    const oldImageUrl = community.theme.icon;
    await editCommunityIcon(community, imageUrl);
    if (oldImageUrl !== 'icon.svg') {
      deleteFile(oldImageUrl);
    }
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const patchCommunityThemeColors = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    isEmpty(validationResult(req));
    const { communityId } = req.params;
    const { userId } = req;
    const community = await getCommunityById(communityId);
    isAuthorized(community.user.toString(), userId);
    const { base, highlight } = req.body;
    const colors = { base, highlight };
    await editCommunityColors(community, colors);
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const getCommunityNames = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { searchTerm } = req.params;
    const communities = await getCommunityNamesBySearchTerm(searchTerm);
    res.status(200).json({ data: { communities } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const getCommunity = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { communityId } = req.params;
    const community = await getCommunityById(communityId);
    res.status(200).json({ data: { community } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};
