import Community from '../../models/Community';
import Rule from '../../models/Rule';
import request from 'supertest';
import mongoose from 'mongoose';
import { mongoURI } from '../../config/db';
import app from '../../app';
import jwt from 'jsonwebtoken';
mongoose.connect(mongoURI, { useNewUrlParser: true });
const port = 8080;
describe('rule routes', (): void => {
  beforeAll(
    async (): Promise<void> => {
      await mongoose.disconnect();
      await mongoose.connect(mongoURI, { useNewUrlParser: true });
      app.listen(port);
      await Community.deleteMany({}).exec();
      await Rule.deleteMany({}).exec();
    },
  );
  beforeEach(
    async (): Promise<void> => {
      await Community.deleteMany({}).exec();
      await Rule.deleteMany({}).exec();
    },
  );
  afterEach(
    async (): Promise<void> => {
      await Community.deleteMany({}).exec();
      await Rule.deleteMany({}).exec();
    },
  );
  afterAll(
    async (): Promise<void> => {
      await Community.deleteMany({}).exec();
      await Rule.deleteMany({}).exec();
      await mongoose.disconnect();
    },
  );
  const name = 'testName';
  const description = 'Lorem ipsum dolor sit amet, consectetur';
  const scope = 'Posts & comments';
  const userId = mongoose.Types.ObjectId();
  const secret: any = process.env.SECRET;
  const email = 'testEmail@email.com';

  const token = jwt.sign(
    {
      email,
      userId,
    },
    secret,
    { expiresIn: '1h' },
  );
  describe('/communities/:communityId/rules', (): void => {
    it('should create a new rule', async (): Promise<void> => {
      const community = new Community({
        name,
        description,
        user: userId,
      });
      await community.save();
      const { _id } = community;
      const response = await request(app)
        .post(`/communities/${_id}/rules`)
        .set('Authorization', 'Bearer ' + token)
        .send({
          name,
          description,
          scope,
        });
      expect(response.status).toEqual(200);
    });
  });
  describe('put /communities/rules/:ruleId', (): void => {
    it('should change the name, description and scope of community', async (): Promise<
      void
    > => {
      const communityId = mongoose.Types.ObjectId();
      const newName = 'newTestName';
      const newDescription = 'Test.Lorem ipsum dolor sit amet, consectetur';
      const newScope = 'Comments only';
      const rule = new Rule({
        name,
        description,
        scope,
        user: userId,
        community: communityId,
      });
      await rule.save();
      const { _id } = rule;
      const response = await request(app)
        .patch(`/communities/rules/${_id}`)
        .set('Authorization', 'Bearer ' + token)
        .send({
          name: newName,
          description: newDescription,
          scope: newScope,
        });
      expect(response.status).toEqual(200);
    });
    it('should return 404 response ', async (): Promise<void> => {
      const ruleId = mongoose.Types.ObjectId();
      const newName = 'newTestName';
      const newDescription = 'Test.Lorem ipsum dolor sit amet, consectetur';
      const newScope = 'Comments only';
      const response = await request(app)
        .patch(`/communities/rules/${ruleId}`)
        .set('Authorization', 'Bearer ' + token)
        .send({
          name: newName,
          description: newDescription,
          scope: newScope,
        });
      expect(response.status).toEqual(404);
    });
  });
  describe('delete /communities/rules/:ruleId', (): void => {
    it('should delete rule', async (): Promise<void> => {
      const communityId = mongoose.Types.ObjectId();
      const rule = new Rule({
        name,
        description,
        scope,
        user: userId,
        community: communityId,
      });
      await rule.save();
      const { _id } = rule;
      const response = await request(app)
        .delete(`/communities/rules/${_id}`)
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toEqual(204);
    });
    it("should return status of 404 if rule isn't found", async (): Promise<
      void
    > => {
      const ruleId = mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/communities/rules/${ruleId}`)
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toEqual(404);
    });
  });
  describe('get /communities/:communityId/rules', (): void => {
    it('should get a list of rules', async (): Promise<void> => {
      const communityId = mongoose.Types.ObjectId();
      const rule = new Rule({
        name,
        description,
        scope,
        user: userId,
        community: communityId,
      });
      await rule.save();
      const response = await request(app)
        .get(`/communities/${communityId}/rules`)
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toEqual(200);
    });
    it('should return 404 response', async (): Promise<void> => {
      const communityId = mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/communities/${communityId}/rules`)
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toEqual(404);
    });
  });
});
