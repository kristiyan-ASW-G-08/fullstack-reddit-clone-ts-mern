import Post from '../../models/Post';
import User from '../../models/User';
import Comment from '../../models/Comment';
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
      await User.deleteMany({}).exec();
      await Post.deleteMany({}).exec();
      await Comment.deleteMany({}).exec();
    },
  );
  afterEach(
    async (): Promise<void> => {
      await User.deleteMany({}).exec();
      await Post.deleteMany({}).exec();
      await Comment.deleteMany({}).exec();
    },
  );
  afterAll(
    async (): Promise<void> => {
      await User.deleteMany({}).exec();
      await Post.deleteMany({}).exec();
      await Comment.deleteMany({}).exec();
      await mongoose.disconnect();
    },
  );
  const text = 'testName';
  const userId = mongoose.Types.ObjectId();
  const secret: any = process.env.SECRET;
  const onModel = 'Post';
  const email = 'testEmail@email.com';
  const token = jwt.sign(
    {
      email,
      userId: userId,
    },
    secret,
    { expiresIn: '1h' },
  );
  describe('post posts/:postId/comments', (): void => {
    it('should create a new comment', async (): Promise<void> => {
      const postId = mongoose.Types.ObjectId();
      const response = await request(app)
        .post(`/posts/${postId}/comments`)
        .set('Authorization', 'Bearer ' + token)
        .send({
          text,
        });
      expect(response.status).toEqual(200);
    });
  });
  describe('post comments/:commentId/comments', (): void => {
    it('should create a new comment', async (): Promise<void> => {
      const commentId = mongoose.Types.ObjectId();
      const response = await request(app)
        .post(`/comments/${commentId}/comments`)
        .set('Authorization', 'Bearer ' + token)
        .send({
          text,
        });
      expect(response.status).toEqual(200);
    });
  });
  describe('patch /comments/:commentId', (): void => {
    const newText = 'newTestText';
    it('should change the text of a comments', async (): Promise<void> => {
      const postId = mongoose.Types.ObjectId();
      const comment = new Comment({
        text,
        user: userId,
        source: postId,
        onModel,
      });
      await comment.save();
      const { _id } = comment;
      const response = await request(app)
        .patch(`/comments/${_id}`)
        .set('Authorization', 'Bearer ' + token)
        .send({
          text: newText,
        });
      expect(response.status).toEqual(200);
    });
    it('should return 404 response ', async (): Promise<void> => {
      const commentId = mongoose.Types.ObjectId();
      const response = await request(app)
        .patch(`/comments/${commentId}`)
        .set('Authorization', 'Bearer ' + token)
        .send({
          text: newText,
        });
      expect(response.status).toEqual(404);
    });
  });
  describe('delete/ comments/:commentId', (): void => {
    it('should delete comment', async (): Promise<void> => {
      const postId = mongoose.Types.ObjectId();
      const comment = new Comment({
        text,
        user: userId,
        source: postId,
        onModel,
      });
      await comment.save();
      const { _id } = comment;
      const response = await request(app)
        .delete(`/comments/${_id}`)
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toEqual(204);
    });
    it('should return  404 response', async (): Promise<void> => {
      const commentId = mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/comments/${commentId}`)
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toEqual(404);
    });
  });
  describe('get posts/:postId?sort=${new,top,comments}&limit=${0-50}&page=${page}', (): void => {
    it('should get a list of comments sorted by postId,sort options,limit and page', async (): Promise<
      void
    > => {
      const postId = mongoose.Types.ObjectId();
      const comment = new Comment({
        text,
        user: userId,
        source: postId,
        onModel,
      });
      await comment.save();
      const response = await request(app).get(
        `/posts/${postId}/comments?sort=new&limit=10&page=1`,
      );
      expect(response.status).toEqual(200);
    });
    it('should return  a 404 response', async (): Promise<void> => {
      const postId = mongoose.Types.ObjectId();
      const response = await request(app).get(
        `/posts/${postId}/comments?sort=new&limit=10&page=1`,
      );
      expect(response.status).toEqual(404);
    });
  });
  describe('get comments/:commentId?sort=${new,top,comments}&limit=${0-50}&page=${page}', (): void => {
    it('should get a list of comments sorted by commentId,sort options,limit and page', async (): Promise<
      void
    > => {
      const commentId = mongoose.Types.ObjectId();
      const comment = new Comment({
        text,
        user: userId,
        source: commentId,
        onModel,
      });
      await comment.save();
      const response = await request(app).get(
        `/comments/${commentId}/comments?sort=new&limit=10&page=1`,
      );
      expect(response.status).toEqual(200);
    });
    it('should return  a 404 response', async (): Promise<void> => {
      const commentId = mongoose.Types.ObjectId();
      const response = await request(app).get(
        `/comments/${commentId}/comments?sort=new&limit=10&page=1`,
      );
      expect(response.status).toEqual(404);
    });
  });
});
