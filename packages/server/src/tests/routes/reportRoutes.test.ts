import Community from '../../models/Community';
import Report from '../../models/Report';
import User from '../../models/User';
import request from 'supertest';
import mongoose from 'mongoose';
import { mongoURI } from '../../config/db';
import app from '../../app';
import jwt from 'jsonwebtoken';
mongoose.connect(mongoURI, { useNewUrlParser: true });
const port = 8080;
describe('report routes', (): void => {
  beforeAll(
    async (): Promise<void> => {
      await mongoose.disconnect();
      await mongoose.connect(mongoURI, { useNewUrlParser: true });
      app.listen(port);
      await Community.deleteMany({}).exec();
      await Report.deleteMany({}).exec();
    },
  );
  beforeEach(
    async (): Promise<void> => {
      await Community.deleteMany({}).exec();
      await Report.deleteMany({}).exec();
    },
  );
  afterEach(
    async (): Promise<void> => {
      await Community.deleteMany({}).exec();
      await Report.deleteMany({}).exec();
    },
  );
  afterAll(
    async (): Promise<void> => {
      await Community.deleteMany({}).exec();
      await Report.deleteMany({}).exec();
      await mongoose.disconnect();
    },
  );
  const name = 'testName';
  const description = 'Lorem ipsum dolor sit amet, consectetur';
  const scope = 'Posts & comments';
  const userId = mongoose.Types.ObjectId();
  const secret: any = process.env.SECRET;
  const communityId = mongoose.Types.ObjectId();
  const reportedUserId = mongoose.Types.ObjectId();
  const ruleId = mongoose.Types.ObjectId();
  const postId = mongoose.Types.ObjectId();
  const commentId = mongoose.Types.ObjectId();
  const email = 'testEmail@email.com';
  const reason = 'It breaks a rule';
  const username = 'username';
  const password = 'password';
  const onModel = 'Post';
  const token = jwt.sign(
    {
      email,
      userId,
    },
    secret,
    { expiresIn: '1h' },
  );
  describe('post /communities/:communityId/posts/:postId/reports', (): void => {
    it('should create a new report', async (): Promise<void> => {
      const response = await request(app)
        .post(`/communities/${communityId}/posts/${postId}/reports`)
        .set('Authorization', 'Bearer ' + token)
        .send({
          reportedUserId,
          reason,
          ruleId,
        });
      expect(response.status).toEqual(204);
    });
  });
  describe('post /communities/:communityId/comments/:commentId/reports', (): void => {
    it('should create a new report', async (): Promise<void> => {
      const response = await request(app)
        .post(`/communities/${communityId}/comments/${commentId}/reports`)
        .set('Authorization', 'Bearer ' + token)
        .send({
          reportedUserId,
          reason,
          ruleId,
        });
      expect(response.status).toEqual(204);
    });
  });
  describe('delete /communities/:communityId/reports/:reportId', (): void => {
    let realCommunityId: string;
    let realReportId: string;
    let userId: string;
    beforeEach(
      async (): Promise<void> => {
        const user = new User({
          email,
          username,
          password,
        });
        await user.save();
        userId = user._id;
        const community = new Community({
          name,
          description,
          user: userId,
        });
        await community.save();
        const report = new Report({
          user: userId,
          reportedUser: userId,
          community: communityId,
          reason,
          source: postId,
          onModel,
        });
        await report.save();
        realCommunityId = community._id;

        realReportId = report._id;
      },
    );
    afterEach(
      async (): Promise<void> => {
        await User.deleteMany({}).exec();
        await Community.deleteMany({}).exec();
        await Report.deleteMany({}).exec();
      },
    );
    const type = 'approved';
    it('should delete a report', async (): Promise<void> => {
      const token = jwt.sign(
        {
          email,
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );
      const response = await request(app)
        .delete(
          `/communities/${realCommunityId}/reports/${realReportId}?type=${type}`,
        )
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toEqual(204);
    });
    it('should return 404 response', async (): Promise<void> => {
      const reportId = mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/communities/${communityId}/reports/${reportId}?type=${type}`)
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toEqual(404);
    });
  });
  describe('get /communities/:communityId/reports', (): void => {
    const userId = mongoose.Types.ObjectId();
    let communityId: string;
    beforeEach(
      async (): Promise<void> => {
        const user = new User({
          email,
          username,
          password,
        });
        await user.save();
        const community = new Community({
          name,
          description,
          user: userId,
        });
        await community.save();
        communityId = community._id;
        const report = new Report({
          user: userId,
          reportedUser: userId,
          community: communityId,
          reason,
          source: postId,
          onModel,
        });
        await report.save();
      },
    );
    afterEach(
      async (): Promise<void> => {
        await User.deleteMany({}).exec();
        await Community.deleteMany({}).exec();
        await Report.deleteMany({}).exec();
      },
    );
    it('should get a list of reports by community Id', async (): Promise<
      void
    > => {
      const token = jwt.sign(
        {
          email,
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );
      const response = await request(app)
        .get(`/communities/${communityId}/reports`)
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toEqual(200);
    });
    it('should return 404 response', async (): Promise<void> => {
      const token = jwt.sign(
        {
          email,
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );
      const communityId = mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/communities/${communityId}/reports`)
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toEqual(404);
    });
  });
});
