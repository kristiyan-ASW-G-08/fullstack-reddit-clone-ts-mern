import Ban from '../reports/Ban';
import BanType from '../types/Ban';
import { ErrorREST, Errors } from '../utilities/ErrorREST';
const createBan = async (
  userId: string,
  bannedUserId: string,
  communityId: string,
  reason: string,
  ruleId: string | undefined,
): Promise<void> => {
  try {
    const ban = new Ban({
      user: userId,
      bannedUser: bannedUserId,
      community: communityId,
      reason,
    });
    if (ruleId) {
      ban.rule = ruleId;
    }
    await ban.save();
  } catch (err) {
    throw err;
  }
};

const getBansByCommunityId = async (
  communityId: string,
): Promise<BanType[]> => {
  try {
    const bans = await Ban.find({ community: communityId });
    if (!bans || bans.length < 0) {
      const { status, message } = Errors.NotFound;
      const error = new ErrorREST(status, message);
      throw error;
    }
    return bans;
  } catch (err) {
    throw err;
  }
};
const getBanById = async (banId: string): Promise<BanType> => {
  try {
    const ban = await Ban.findById(banId);
    if (!ban) {
      const { status, message } = Errors.NotFound;
      const error = new ErrorREST(status, message);
      throw error;
    }
    return ban;
  } catch (err) {
    throw err;
  }
};

export { createBan, getBansByCommunityId, getBanById };
