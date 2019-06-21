import Post from '../../models/Post';
import request from 'supertest';
import mongoose from 'mongoose';
import { mongoURI } from '../../config/db';
import app from '../../app';
import jwt from 'jsonwebtoken';
import mock from 'mock-fs';
import User from '../../models/User';
mongoose.connect(mongoURI, { useNewUrlParser: true });
const port = 8080;
describe('Post routes', (): void => {
  beforeAll(
    async (): Promise<void> => {
      await mongoose.disconnect();
      await mongoose.connect(mongoURI, { useNewUrlParser: true });
      app.listen(port);

      await Post.deleteMany({}).exec();
    },
  );
  beforeEach(
    async (): Promise<void> => {
      await Post.deleteMany({}).exec();
    },
  );
  afterEach(
    async (): Promise<void> => {
      await Post.deleteMany({}).exec();
    },
  );
  afterAll(
    async (): Promise<void> => {
      await Post.deleteMany({}).exec();
      await mongoose.disconnect();
    },
  );
  const title = 'testName';
  const text = 'Lorem ipsum dolor sit amet, consectetur';
  const userId = mongoose.Types.ObjectId().toString();
  const communityId = mongoose.Types.ObjectId().toString();
  const secret: any = process.env.SECRET;
  const email = 'testEmail@email.com';
  const username = 'test2UserName';
  const password = '1234567891011';
  const token = jwt.sign(
    {
      email,
      userId,
    },
    secret,
    { expiresIn: '1h' },
  );
  describe('post /communities/:communityId/posts', (): void => {
    let realUserId: string;
    beforeEach(
      async (): Promise<void> => {
        const user = new User({
          email,
          username,
          password,
        });
        await user.save();
        realUserId = user._id;
      },
    );
    afterEach(
      async (): Promise<void> => {
        await User.deleteMany({}).exec();
        mock.restore();
      },
    );
    it('should create a new post', async (): Promise<void> => {
      const realUserToken = jwt.sign(
        {
          email,
          userId: realUserId,
        },
        secret,
        { expiresIn: '1h' },
      );
      const type = 'text';

      const response = await request(app)
        .post(`/communities/${communityId}/posts`)
        .set('Authorization', 'Bearer ' + realUserToken)
        .send({
          title,
          text,
          type,
        });
      expect(response.status).toEqual(200);
    });
    it('should create a new link post', async (): Promise<void> => {
      const realUserToken = jwt.sign(
        {
          email,
          userId: realUserId,
        },
        secret,
        { expiresIn: '1h' },
      );
      const type = 'link';
      const linkUrl = 'https://testLink.com';
      const response = await request(app)
        .post(`/communities/${communityId}/posts`)
        .set('Authorization', 'Bearer ' + realUserToken)
        .send({
          title,
          linkUrl,
          type,
        });
      expect(response.status).toEqual(200);
    });
    it('should create a new image post', async (): Promise<void> => {
      const realUserToken = jwt.sign(
        {
          email,
          userId: realUserId,
        },
        secret,
        { expiresIn: '1h' },
      );
      mock({
        'assets/images': {
          'test.jpg': Buffer.from([8, 6, 7, 5, 3, 0, 9]),
        },
      });
      const type = 'image';
      const response = await request(app)
        .post(`/communities/${communityId}/posts`)
        .attach('image', 'assets/images/test.jpg')
        .set('Authorization', 'Bearer ' + realUserToken)
        .field({
          title,
          type,
        });
      expect(response.status).toEqual(200);
    });
  });
  describe('get communities/communityId/posts?sort=${new,top,comments}&limit=${0-50}&page=${page}', (): void => {
    it('should get a list of posts by community Id', async (): Promise<
      void
    > => {
      const type = 'text';
      const post = new Post({
        type,
        title,
        text,
        user: userId,
        community: communityId,
      });
      await post.save();
      const response = await request(app).get(
        `/communities/${communityId}/posts?sort=new&limit=10&page=1`,
      );
      expect(response.status).toEqual(200);
    });
    it('should return 404 response', async (): Promise<void> => {
      const response = await request(app).get(
        `/communities/${communityId}/posts?sort=new&limit=10&page=1`,
      );
      expect(response.status).toEqual(404);
    });
  });
  describe('get /posts?sort=${new,top,comments}&limit=${0-50}&page=${page}', (): void => {
    it('should get a list of posts', async (): Promise<void> => {
      const type = 'text';
      const post = new Post({
        type,
        title,
        text,
        user: userId,
        community: communityId,
      });
      await post.save();
      const response = await request(app).get(
        `/posts?sort=new&limit=10&page=1`,
      );
      expect(response.status).toEqual(200);
    });
    it('should return  404 response', async (): Promise<void> => {
      const response = await request(app).get(
        `/posts?sort=new&limit=10&page=1`,
      );
      expect(response.status).toEqual(404);
    });
  });
  describe('get communities/communityId/posts?sort=${new,top,comments}&limit=${0-50}&page=${page}', (): void => {
    it('should get a list of posts by community Id', async (): Promise<
      void
    > => {
      const type = 'text';
      const post = new Post({
        type,
        title,
        text,
        user: userId,
        community: communityId,
      });
      await post.save();
      const response = await request(app).get(
        `/communities/${communityId}/posts?sort=new&limit=10&page=1`,
      );
      expect(response.status).toEqual(200);
    });
    it('should return 404 response', async (): Promise<void> => {
      const response = await request(app).get(
        `/communities/${communityId}/posts?sort=new&limit=10&page=1`,
      );
      expect(response.status).toEqual(404);
    });
  });
  describe('get /users/posts?sort=${new,top,comments}&limit=${0-50}&page=${page}', (): void => {
    it('should get a list of posts', async (): Promise<void> => {
      const newUser = new User({
        username: 'newTestUser',
        email: 'someTest@test.com',
        password: '1231231231231231',
      });
      newUser.communities = [communityId];
      await newUser.save();
      const newToken = jwt.sign(
        {
          email,
          userId: newUser._id.toString(),
        },
        secret,
        { expiresIn: '1h' },
      );
      const type = 'text';
      const post = new Post({
        type,
        title,
        text,
        user: userId,
        community: communityId,
      });
      await post.save();
      const response = await request(app)
        .get(`/users/posts?sort=new&limit=10&page=1`)
        .set('Authorization', 'Bearer ' + newToken);
      expect(response.status).toEqual(200);
    });
    it('should return  404 response', async (): Promise<void> => {
      const newUser = new User({
        username: 'someNewTestUser',
        email: 'someNewTest@test.com',
        password: '1231231231231231',
      });
      newUser.communities = [communityId];
      await newUser.save();
      const newToken = jwt.sign(
        {
          email,
          userId: newUser._id.toString(),
        },
        secret,
        { expiresIn: '1h' },
      );
      const response = await request(app)
        .get(`/users/posts?sort=new&limit=10&page=1`)
        .set('Authorization', 'Bearer ' + newToken);
      expect(response.status).toEqual(404);
    });
  });
  describe('delete posts/:postId', (): void => {
    it('should delete a post', async (): Promise<void> => {
      const type = 'text';
      const post = new Post({
        type,
        title,
        text,
        user: userId,
        community: communityId,
      });
      await post.save();
      const { _id } = post;
      const response = await request(app)
        .delete(`/posts/${_id}`)
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toEqual(204);
    });
    it('should return 404 response', async (): Promise<void> => {
      const postId = mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/posts/${postId}`)
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toEqual(404);
    });
  });
  describe('patch /posts/:postId', (): void => {
    const newText = 'newText';
    const newTitle = 'newTitle';
    it('should patch a post', async (): Promise<void> => {
      const type = 'text';
      const post = new Post({
        type,
        title,
        text,
        user: userId,
        community: communityId,
      });
      await post.save();
      const { _id } = post;
      const response = await request(app)
        .patch(`/posts/${_id}`)
        .set('Authorization', 'Bearer ' + token)
        .send({
          title: newTitle,
          text: newText,
        });
      expect(response.status).toEqual(204);
    });
    it('should return 404 response', async (): Promise<void> => {
      const postId = mongoose.Types.ObjectId();
      const response = await request(app)
        .patch(`/posts/${postId}`)
        .set('Authorization', 'Bearer ' + token)
        .send({
          title: newTitle,
          text: newText,
        });
      expect(response.status).toEqual(404);
    });
  });
});
