import Rule from '../models/Rule';
import RuleType from '../types/Rule';
import isAuthorized from '../utilities/isAuthorized';
import { ErrorREST, Errors } from '../classes/ErrorREST';
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
  try {
    const rule = await Rule.findById(ruleId);
    if (!rule) {
      const { status, message } = Errors.NotFound;
      const error = new ErrorREST(status, message, {});
      throw error;
    }
    return rule;
  } catch (err) {
    throw err;
  }
};
const deleteRuleById = async (
  ruleId: string,
  userId: string,
): Promise<void> => {
  try {
    const rule = await getRuleById(ruleId);
    isAuthorized(rule.user, userId);
    rule.remove();
    await rule.save();
  } catch (err) {
    throw err;
  }
};
export { createRule, getRuleById, deleteRuleById };
