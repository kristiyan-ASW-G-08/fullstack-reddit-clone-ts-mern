import { createRule, getRuleById } from '../../services/ruleServices';
import Rule from '../../models/Rule';
import { ErrorREST, Errors } from '../../classes/ErrorREST';
import mongoose from 'mongoose';
import { mongoURI } from '../../config/db';
describe('ruleServices', (): void => {
  beforeAll(
    async (): Promise<void> => {
      mongoose.connect(mongoURI, { useNewUrlParser: true });
      await Rule.deleteMany({}).exec();
    },
  );
  beforeEach(
    async (): Promise<void> => {
      await Rule.deleteMany({});
    },
  );
  afterEach(
    async (): Promise<void> => {
      await Rule.deleteMany({}).exec();
    },
  );
  afterAll(
    async (): Promise<void> => {
      await Rule.deleteMany({}).exec();
      await mongoose.disconnect();
    },
  );
  const name = 'testName';
  const description = 'Lorem ipsum dolor sit amet, consectetur';
  const userId = mongoose.Types.ObjectId().toString();
  const scope = 'Posts & comments';
  const communityId = mongoose.Types.ObjectId().toString();
  describe('createRule', (): void => {
    it(`should create new rule`, async (): Promise<void> => {
      const ruleId = await createRule(
        name,
        description,
        scope,
        communityId,
        userId,
      );
      expect(ruleId).toBeTruthy();
      const rule = await Rule.findById(ruleId);
      if (!rule) {
        return;
      }
      expect(rule.name).toMatch(name);
      expect(rule.description).toMatch(description);
      expect(rule.scope).toMatch(scope);
    });
  });
  describe('getRuleById', (): void => {
    it(`should return a rule`, async (): Promise<void> => {
      const newRule = new Rule({
        name,
        description,
        scope,
        community: communityId,
        user: userId,
      });
      await newRule.save();
      const { _id } = newRule;

      const rule = await getRuleById(_id);
      if (!rule) {
        return;
      }
      expect(rule.name).toMatch(name);
      expect(rule.description).toMatch(description);
      expect(rule.scope).toMatch(scope);
    });

    it(`shouldn't throw an error if rule isn't found`, async (): Promise<
      void
    > => {
      const id = mongoose.Types.ObjectId().toString();
      const { status, message } = Errors.NotFound;
      const error = new ErrorREST(status, message, null);
      await expect(getRuleById(id)).rejects.toThrow(error);
    });
  });
});
