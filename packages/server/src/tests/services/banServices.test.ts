import {
  createBan,
  getBanById,
  getBansByCommunityId,
} from '../../services/banServices';
import Ban from '../../reports/Ban';
import { ErrorREST, Errors } from '../../utilities/ErrorREST';
import mongoose from 'mongoose';
import { mongoURI } from '../../config/db';
describe('banServices', (): void => {
  beforeAll(
    async (): Promise<void> => {
      mongoose.connect(mongoURI, { useNewUrlParser: true });
      await Ban.deleteMany({}).exec();
    },
  );
  beforeEach(
    async (): Promise<void> => {
      await Ban.deleteMany({});
    },
  );
  afterEach(
    async (): Promise<void> => {
      await Ban.deleteMany({}).exec();
    },
  );
  afterAll(
    async (): Promise<void> => {
      await Ban.deleteMany({}).exec();
      await mongoose.disconnect();
    },
  );

  const userId = mongoose.Types.ObjectId().toString();
  const reason = 'It breaks a rule';
  const communityId = mongoose.Types.ObjectId().toString();
  const ruleId = mongoose.Types.ObjectId().toString();
  describe('createBan', (): void => {
    it(`should create new ban`, async (): Promise<void> => {
      await createBan(userId, userId, communityId, reason, ruleId);
      expect(ruleId).toBeTruthy();
      const ban = await Ban.findById(ruleId);
      if (!ban) {
        return;
      }
      expect(ban.reason).toMatch(reason);
    });
  });
  describe('getBanById', (): void => {
    it(`should return a ban`, async (): Promise<void> => {
      const newBan = new Ban({
        reason,
        bannedUser: userId,
        community: communityId,
        user: userId,
      });
      await newBan.save();
      const { _id } = newBan;

      const ban = await getBanById(_id);
      if (!ban) {
        return;
      }
      expect(ban.reason).toMatch(reason);
    });

    it(`shouldn't throw an error if rule isn't found`, async (): Promise<
      void
    > => {
      const id = mongoose.Types.ObjectId().toString();
      const { status, message } = Errors.NotFound;
      const error = new ErrorREST(status, message, null);
      await expect(getBanById(id)).rejects.toThrow(error);
    });
  });
  describe('getBansByCommunityId', (): void => {
    it(`should return a list of bans`, async (): Promise<void> => {
      const secondCommunityId = mongoose.Types.ObjectId().toString();
      const bansArr = [
        {
          reason,
          bannedUser: userId,
          community: communityId,
          user: userId,
        },
        {
          reason,
          bannedUser: userId,
          community: communityId,
          user: userId,
        },
        {
          reason,
          bannedUser: userId,
          community: secondCommunityId,
          user: userId,
        },
      ];

      await Ban.insertMany(bansArr);
      const communityRules = await getBansByCommunityId(communityId);
      const secondCommunityRules = await getBansByCommunityId(
        secondCommunityId,
      );
      expect(communityRules).toHaveLength(2);
      expect(secondCommunityRules).toHaveLength(1);
    });

    it(`shouldn't throw an error if no bans are found found`, async (): Promise<
      void
    > => {
      const { status, message } = Errors.NotFound;
      const error = new ErrorREST(status, message, null);
      await expect(getBansByCommunityId(communityId)).rejects.toThrow(error);
    });
  });
});
