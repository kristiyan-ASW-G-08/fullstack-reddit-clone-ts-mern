import Rule from '../models/Rule';
import RuleType from '../types/Rule';
import ValidationError from '../types/ValidationError';
import { ErrorREST, Errors } from '../classes/ErrorREST';
import isAuthorized from '../utilities/isAuthorized';
import { getCommunityById } from './communityServices';
import { getUserById } from './userServices';
const createRule = async (
  name: string,
  description: string,
  scope: string,
  communityId: string,
  userId: string,
): Promise<string> => {
  try {
    const rule = new Rule({
      name,
      description,
      scope,
      community: communityId,
      user: userId,
    });
    const ruleId = rule._id.toString();
    await rule.save();
    return ruleId;
  } catch (err) {
    throw err;
  }
};

const getRuleById = async (ruleId: string): Promise<RuleType> => {
  const rule = await Rule.findById(ruleId);
  if (!rule) {
    const { status, message } = Errors.NotFound;
    const error = new ErrorREST(status, message, {});
    throw error;
  }
  return rule;
};

export { createRule, getRuleById };
