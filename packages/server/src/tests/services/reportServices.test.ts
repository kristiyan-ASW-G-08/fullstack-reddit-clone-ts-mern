import {
  createReport,
  getReportById,
  getReportsByCommunityId,
} from '../../services/reportServices';
import Report from '../../models/Report';
import { ErrorREST, Errors } from '../../classes/ErrorREST';
import mongoose from 'mongoose';
import { mongoURI } from '../../config/db';
describe('reportServices', (): void => {
  beforeAll(
    async (): Promise<void> => {
      mongoose.connect(mongoURI, { useNewUrlParser: true });
      await Report.deleteMany({}).exec();
    },
  );
  beforeEach(
    async (): Promise<void> => {
      await Report.deleteMany({});
    },
  );
  afterEach(
    async (): Promise<void> => {
      await Report.deleteMany({}).exec();
    },
  );
  afterAll(
    async (): Promise<void> => {
      await Report.deleteMany({}).exec();
      await mongoose.disconnect();
    },
  );
  const reason = 'It breaks a rule';
  const userId = mongoose.Types.ObjectId().toString();
  const communityId = mongoose.Types.ObjectId().toString();
  const ruleId = mongoose.Types.ObjectId().toString();
  const sourceId = mongoose.Types.ObjectId().toString();
  const onModel = 'Post';
  describe('createReport', (): void => {
    it(`should create new rule`, async (): Promise<void> => {
      await createReport(
        userId,
        userId,
        communityId,
        ruleId,
        sourceId,
        reason,
        onModel,
      );
      const report = await Report.findById(ruleId);
      if (!report) {
        return;
      }
      expect(report.reason).toMatch(reason);
    });
  });
  describe('getReportById', (): void => {
    it(`should return a rule`, async (): Promise<void> => {
      const newReport = new Report({
        user: userId,
        reportedUser: userId,
        community: communityId,
        reason,
        source: sourceId,
        onModel,
      });
      await newReport.save();
      const { _id } = newReport;

      const report = await getReportById(_id);
      if (!report) {
        return;
      }
      expect(report.reason).toMatch(reason);
    });

    it(`shouldn't throw an error if report isn't found`, async (): Promise<
      void
    > => {
      const id = mongoose.Types.ObjectId().toString();
      const { status, message } = Errors.NotFound;
      const error = new ErrorREST(status, message, null);
      await expect(getReportById(id)).rejects.toThrow(error);
    });
  });
  describe('getReportsByCommunityId', (): void => {
    it(`should return a list of rules`, async (): Promise<void> => {
      const secondCommunityId = mongoose.Types.ObjectId().toString();
      const reportsArr = [
        {
          user: userId,
          reportedUser: userId,
          community: communityId,
          reason,
          source: sourceId,
          onModel,
        },
        {
          user: userId,
          reportedUser: userId,
          community: communityId,
          reason,
          source: sourceId,
          onModel,
        },
        {
          user: userId,
          reportedUser: userId,
          community: secondCommunityId,
          reason,
          source: sourceId,
          onModel,
        },
      ];

      await Report.insertMany(reportsArr);
      const communityRules = await getReportsByCommunityId(communityId);
      const secondCommunityRules = await getReportsByCommunityId(
        secondCommunityId,
      );
      expect(communityRules).toHaveLength(2);
      expect(secondCommunityRules).toHaveLength(1);
    });

    it(`shouldn't throw an error if no reports are found found`, async (): Promise<
      void
    > => {
      const { status, message } = Errors.NotFound;
      const error = new ErrorREST(status, message, null);
      await expect(getReportsByCommunityId(communityId)).rejects.toThrow(error);
    });
  });
});
