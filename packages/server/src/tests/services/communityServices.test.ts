import {
  createCommunity,
  editCommunityInfo,
  editCommunityColors,
  editCommunityIcon,
  getCommunityById,
  getCommunityNamesBySearchTerm,
} from '../../services/communityServices';
import Community from '../../models/Community';
import { ErrorREST, Errors } from '../../classes/ErrorREST';
import mongoose from 'mongoose';
import { mongoURI } from '../../config/db';
describe('userServices', (): void => {
  beforeAll(
    async (): Promise<void> => {
      mongoose.connect(mongoURI, { useNewUrlParser: true });
      await Community.deleteMany({}).exec();
    },
  );
  beforeEach(
    async (): Promise<void> => {
      await Community.deleteMany({});
    },
  );
  afterEach(
    async (): Promise<void> => {
      await Community.deleteMany({}).exec();
    },
  );
  afterAll(
    async (): Promise<void> => {
      await Community.deleteMany({}).exec();
      await mongoose.disconnect();
    },
  );
  describe('createCommunity', (): void => {
    it(`should create new community`, async (): Promise<void> => {
      const name = 'testName';
      const description = 'testDescription';
      const userId = mongoose.Types.ObjectId().toString();
      const communityId = await createCommunity(name, description, userId);
      expect(communityId).toBeTruthy();
      const community = await Community.findById(communityId);
      if (!community) {
        return;
      }
      expect(community.name).toMatch(name);
      expect(community.description).toMatch(description);
      expect(community.user.toString()).toMatch(userId);
    });
  });
  describe('getCommunityNamesBySearchTerm', (): void => {
    it(`should return a community`, async (): Promise<void> => {
      const communitiesArr = [
        {
          name: 'testOne',
          description: 'Testing',
          user: mongoose.Types.ObjectId().toString(),
        },
        {
          name: 'testTwo',
          description: 'Testing',
          user: mongoose.Types.ObjectId().toString(),
        },
        {
          name: 'Something',
          description: 'Something',
          user: mongoose.Types.ObjectId().toString(),
        },
      ];

      await Community.insertMany(communitiesArr);
      const searchTerm = 'test';
      const communities = await getCommunityNamesBySearchTerm(searchTerm);
      expect(communities.length).toEqual(2);
    });
  });

  describe('getCommunityById', (): void => {
    it(`should return a community`, async (): Promise<void> => {
      const name = 'testName';
      const description = 'testDescription';
      const userId = mongoose.Types.ObjectId().toString();
      const newCommunity = new Community({
        name,
        description,
        user: userId,
      });
      await newCommunity.save();
      const { _id } = newCommunity;
      const community = await getCommunityById(_id);
      if (!community) {
        return;
      }
      expect(community.name).toMatch(name);
      expect(community.description).toMatch(description);
      expect(community.user.toString()).toMatch(userId);
    });

    it(`should throw an error if community isn't found`, async (): Promise<
      void
    > => {
      const communityId = mongoose.Types.ObjectId().toString();
      const { status, message } = Errors.NotFound;
      const error = new ErrorREST(status, message, null);
      await expect(getCommunityById(communityId)).rejects.toThrow(error);
    });
  });

  describe('editCommunityInfo', (): void => {
    it(`should  edit the name and description of  community`, async (): Promise<
      void
    > => {
      const name = 'testName';
      const description = 'testDescription';
      const userId = mongoose.Types.ObjectId().toString();
      const newCommunity = new Community({
        name,
        description,
        user: userId,
      });
      await newCommunity.save();
      const { _id } = newCommunity;
      const newName = 'newTestName';
      const newDescription = 'newTestDescription';
      await editCommunityInfo(_id, newName, newDescription, userId);
      await newCommunity.save();
      const community = await Community.findById(_id);
      if (!community) {
        return;
      }
      expect(community.name).toMatch(newName);
      expect(community.description).toMatch(newDescription);
      expect(community.user.toString()).toMatch(userId);
    });

    it(`should throw an error if community isn't found`, async (): Promise<
      void
    > => {
      const communityId = mongoose.Types.ObjectId().toString();
      const userId = mongoose.Types.ObjectId().toString();
      const newName = 'newTestName';
      const newDescription = 'newTestDescription';
      const { status, message } = Errors.NotFound;
      const error = new ErrorREST(status, message, null);
      await expect(
        editCommunityInfo(communityId, newName, newDescription, userId),
      ).rejects.toThrow(error);
    });
  });
  describe('editCommunityIcon', (): void => {
    it(`should  edit icon of community`, async (): Promise<void> => {
      const name = 'testName';
      const description = 'testDescription';
      const userId = mongoose.Types.ObjectId().toString();
      const community = new Community({
        name,
        description,
        user: userId,
      });
      await community.save();
      const iconUrl = '/icon.svg';
      await editCommunityIcon(community, iconUrl);
      expect(community.theme.icon).toMatch(iconUrl);
    });
  });
  describe('editCommunityColors', (): void => {
    it(`should  edit the colors of  community`, async (): Promise<void> => {
      const name = 'testName';
      const description = 'testDescription';
      const userId = mongoose.Types.ObjectId().toString();
      const community = new Community({
        name,
        description,
        user: userId,
      });
      const colors = {
        base: 'baseColor',
        highlight: 'highlightColor',
      };
      await community.save();
      await editCommunityColors(community, colors);
      expect(community.theme.colors).toEqual(colors);
    });
  });
});
