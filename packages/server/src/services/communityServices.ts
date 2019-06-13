import Community from '../models/Community';
import CommunityType from '../types/Community';
import mongoose from 'mongoose';
import UserType from '../types/User';
import ValidationError from '../types/ValidationError';
import { ErrorREST, Errors } from '../classes/ErrorREST';
import isAuthorized from '../utilities/isAuthorized';
import Colors from '@rddt/common/types/Colors';
const createCommunity = async (
  name: string,
  description: string,
  userId: string,
): Promise<string> => {
  try {
    const community = new Community({
      name,
      description,
      user: userId,
    });
    const communityId = community._id.toString();
    await community.save();
    return communityId;
  } catch (err) {
    throw err;
  }
};
const getCommunityById = async (
  communityId: string,
): Promise<CommunityType> => {
  try {
    const community = await Community.findById(communityId);
    if (!community) {
      const { status, message } = Errors.NotFound;
      const error = new ErrorREST(status, message);
      throw error;
    }
    return community;
  } catch (err) {
    throw err;
  }
};
// const editCommunityById = async (
//   communityId: string,
//   editObject: EditObject,
// ): Promise<void> => {
//   try {
//     const community = await Community.findByIdAndUpdate(
//       communityId,
//       editObject,
//     );
//     if (!community) {
//       const { status, message } = Errors.NotFound;
//       const error = new ErrorREST(status, message, {});
//       throw error;
//     }
//     await community.save();
//   } catch (err) {
//     throw err;
//   }
// };
const editCommunityInfo = async (
  communityId: string,
  name: string,
  description: string,
  userId: string,
): Promise<void> => {
  try {
    const community = await getCommunityById(communityId);
    isAuthorized(community.user.toString(), userId);
    community.name = name;
    community.description = description;
    await community.save();
  } catch (err) {
    throw err;
  }
};

const editCommunityIcon = async (
  community: CommunityType,
  iconUrl: string,
): Promise<void> => {
  try {
    community.theme.icon = iconUrl;
    await community.save();
  } catch (err) {
    throw err;
  }
};
const editCommunityColors = async (
  community: CommunityType,
  colors: Colors,
): Promise<void> => {
  try {
    community.theme.colors = colors;
    await community.save();
  } catch (err) {
    throw err;
  }
};
export {
  createCommunity,
  editCommunityInfo,
  editCommunityColors,
  editCommunityIcon,
  getCommunityById,
};
