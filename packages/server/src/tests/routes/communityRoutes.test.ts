import Community from '../../models/Community';
import request from 'supertest';
import mongoose from 'mongoose';
import { mongoURI } from '../../config/db';
import app from '../../app';
import jwt from 'jsonwebtoken';
mongoose.connect(mongoURI, { useNewUrlParser: true });
const port = 8080;
jest.mock('../../services/sendConfirmationEmail');
describe('community routes', (): void => {
  beforeAll(
    async (): Promise<void> => {
      await mongoose.disconnect();
      await mongoose.connect(mongoURI, { useNewUrlParser: true });
      app.listen(port);
    },
  );
  beforeEach(
    async (): Promise<void> => {
      await Community.deleteMany({}).exec();
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
  const name = 'testName';
  const description = 'Lorem ipsum dolor sit amet, consectetur.';
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
  describe('/communities', (): void => {
    it('should create a new community', async (): Promise<void> => {
      const response = await request(app)
        .post('/communities')
        .set('Authorization', 'Bearer ' + token)
        .send({
          name,
          description,
        });
      expect(response.status).toEqual(200);
    });
    it('should throw an error if name is already used', async (): Promise<
      void
    > => {
      const community = new Community({
        name,
        description,
        user: userId,
      });
      await community.save();
      const response = await request(app)
        .post('/communities')
        .set('Authorization', 'Bearer ' + token)
        .send({
          name,
          description,
        });
      expect(response.status).toEqual(400);
    });
  });
  describe('patch /communities/:communityId', (): void => {
    it('should change the name and description of community', async (): Promise<
      void
    > => {
      const community = new Community({
        name,
        description,
        user: userId,
      });
      await community.save();
      const { _id } = community;
      const newName = 'newTestName';
      const newDescription = 'Test.Lorem ipsum dolor sit amet, consectetur.';
      const response = await request(app)
        .patch(`/communities/${_id}`)
        .set('Authorization', 'Bearer ' + token)
        .send({
          name: newName,
          description: newDescription,
        });
      expect(response.status).toEqual(200);
    });
    it("should return 404 if  community isn't found", async (): Promise<
      void
    > => {
      const communityId = mongoose.Types.ObjectId();
      const newName = 'newTestName';
      const newDescription = 'Test.Lorem ipsum dolor sit amet, consectetur.';
      const response = await request(app)
        .patch(`/communities/${communityId}`)
        .set('Authorization', 'Bearer ' + token)
        .send({
          name: newName,
          description: newDescription,
        });
      expect(response.status).toEqual(404);
    });
  });
  describe('/communities/:communityId/themes', (): void => {
    it('should change the colors of community', async (): Promise<void> => {
      const community = new Community({
        name,
        description,
        user: userId,
      });
      await community.save();
      const { _id } = community;
      const base = 'newBaseColor';
      const highlight = 'newHighlightColor';

      const response = await request(app)
        .patch(`/communities/${_id}/themes`)
        .set('Authorization', 'Bearer ' + token)
        .send({
          base,
          highlight,
        });
      expect(response.status).toEqual(204);
    });
    it("should return 404 if  community isn't found", async (): Promise<
      void
    > => {
      const communityId = mongoose.Types.ObjectId();
      const newName = 'newTestName';
      const newDescription = 'Test.Lorem ipsum dolor sit amet, consectetur.';
      const response = await request(app)
        .patch(`/communities/${communityId}/themes`)
        .set('Authorization', 'Bearer ' + token)
        .send({
          name: newName,
          description: newDescription,
        });
      expect(response.status).toEqual(404);
    });
  });
  describe('get /communities/:communityId', (): void => {
    it('should get community', async (): Promise<void> => {
      const community = new Community({
        name,
        description,
        user: userId,
      });
      await community.save();
      const { _id } = community;
      const response = await request(app)
        .get(`/communities/${_id}`)
        .set('Authorization', 'Bearer ' + token);

      expect(response.status).toEqual(200);
    });
    it("should return 404 if  community isn't found", async (): Promise<
      void
    > => {
      const communityId = mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/communities/${communityId}`)
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toEqual(404);
    });
  });
  describe('get /communities/:searchTerm/names', (): void => {
    const searchTerm = 'test';
    it('should get community names', async (): Promise<void> => {
      const community = new Community({
        name,
        description,
        user: userId,
      });
      await community.save();
      const response = await request(app)
        .get(`/communities/${searchTerm}/names`)
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toEqual(200);
    });
  });
});
