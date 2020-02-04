import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator/check';
import isEmpty from '../utilities/isEmpty';
import passErrorToNext from '../utilities/passErrorToNext';
import { ErrorREST, Errors } from '../utilities/ErrorREST';
import {
  createRule,
  getRuleById,
  getRulesByCommunityId,
} from '../services/ruleServices';
import isAuthorized from '../utilities/isAuthorized';
import { getCommunityById } from '../services/communityServices';
export const postRule = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    isEmpty(validationResult(req));
    const { communityId } = req.params;
    const { userId } = req;
    const { name, description, scope } = req.body;
    const community = await getCommunityById(communityId);
    isAuthorized(community.user.toString(), userId);
    const rule = await createRule(
      name,
      description,
      scope,
      communityId,
      userId,
    );
    res.status(200).json({ data: { rule } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};
export const patchRule = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    isEmpty(validationResult(req));
    const { name, description, scope } = req.body;
    const { userId } = req;
    const { ruleId } = req.params;
    const rule = await getRuleById(ruleId);
    isAuthorized(rule.user, userId);
    rule.name = name;
    rule.description = description;
    rule.scope = scope;
    await rule.save();
    res.status(200).json({ data: { rule } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};
export const deleteRule = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req;
    const { ruleId } = req.params;
    const rule = await getRuleById(ruleId);
    isAuthorized(rule.user, userId);
    rule.remove();
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const getRules = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { communityId } = req.params;
    const rules = await getRulesByCommunityId(communityId);
    res.status(200).json({ data: { rules } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};
