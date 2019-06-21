import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator/check';
import isEmpty from '../utilities/isEmpty';
import passErrorToNext from '../utilities/passErrorToNext';
import { ErrorREST, Errors } from '../classes/ErrorREST';
import {
  createReport,
  getReportsByCommunityId,
  getReportById,
} from '../services/reportServices';
import { toggleHiddenPosts } from '../services/postServices';
import { toggleHiddenComments } from '../services/commentServices';
import { createBan } from '../services/banServices';
import { getUserById } from '../services/userServices';
import isAuthorized from '../utilities/isAuthorized';
import { getCommunityById } from '../services/communityServices';
export const reportPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    isEmpty(validationResult(req));
    const { userId } = req;
    const { communityId, postId } = req.params;
    const { reason, reportedUserId, ruleId } = req.body;
    const onModel = 'Post';
    await createReport(
      userId,
      reportedUserId,
      communityId,
      ruleId,
      postId,
      reason,
      onModel,
    );
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};
export const reportComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    isEmpty(validationResult(req));
    const { userId } = req;
    const { communityId, commentId } = req.params;
    const { reason, reportedUserId, ruleId } = req.body;
    const onModel = 'Comment';
    await createReport(
      userId,
      reportedUserId,
      communityId,
      ruleId,
      commentId,
      reason,
      onModel,
    );
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};
export const deleteReport = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    isEmpty(validationResult(req));
    const { userId } = req;
    const { type } = req.query;
    const { communityId, reportId } = req.params;
    const community = await getCommunityById(communityId);
    isAuthorized(community.user, userId);
    const report = await getReportById(reportId);
    if (type === 'approved') {
      const { reportedUser, reason, rule } = report;
      await createBan(userId, reportedUser, communityId, reason, rule);
      await toggleHiddenPosts(userId, true, communityId);
      // await toggleHiddenComments(userId, true, communityId);
      const bannedUser = await getUserById(reportedUser);
      bannedUser.bans.push(communityId);
      await bannedUser.save();
    }
    report.remove();
    await report.save();
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const getReports = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { communityId } = req.params;
    const { userId } = req;
    const community = await getCommunityById(communityId);
    isAuthorized(community.user, userId);
    const reports = await getReportsByCommunityId(communityId);
    res.status(200).json({ data: { reports } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};
