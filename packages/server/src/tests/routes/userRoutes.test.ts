import User from '../../users/User';
import request from 'supertest';
import mongoose from 'mongoose';
import { mongoURI } from '../../config/db';
import bcrypt from 'bcryptjs';
import app from '../../app';
import sendConfirmationEmail from '../../utilities/sendConfirmationEmail';
import jwt from 'jsonwebtoken';
import Post from '../../posts/Post';
import Comment from '../../comments/Comment';
mongoose.connect(mongoURI, { useNewUrlParser: true });
const port = 8080;
jest.mock('../../utilities/sendConfirmationEmail');
describe('user routes', (): void => {
  const username = 'test2UserName';
  const email = 'testMail@mail.com';
  const password = '1234567891011';
  let hashedPassword: string;
  beforeAll(
    async (): Promise<void> => {
      hashedPassword = await bcrypt.hash(password, 12);
      await mongoose.disconnect();
      await mongoose.connect(mongoURI, { useNewUrlParser: true });
      app.listen(port);
      await User.deleteMany({}).exec();
    },
  );
  beforeEach(
    async (): Promise<void> => {
      await User.deleteMany({}).exec();
    },
  );
  afterEach(
    async (): Promise<void> => {
      await User.deleteMany({}).exec();
    },
  );
  afterAll(
    async (): Promise<void> => {
      await User.deleteMany({}).exec();
      await mongoose.disconnect();
    },
  );

  describe('/users', (): void => {
    it('should sign up a new user', async (): Promise<void> => {
      const response = await request(app)
        .post('/users')
        .send({
          email,
          username,
          password,
          matchPassword: password,
        });
      expect(response.status).toEqual(204);
      expect(sendConfirmationEmail).toBeCalledTimes(1);
    });
    it('should throw an error if username or email are already used', async (): Promise<
      void
    > => {
      const user = new User({
        email,
        username,
        password,
      });
      await user.save();
      const response = await request(app)
        .post('/users')
        .send({
          email,
          username,
          password,
          matchPassword: password,
        });
      expect(response.status).toEqual(400);
    });
  });

  describe('/users/token', (): void => {
    it('should return token', async (): Promise<void> => {
      const user = new User({
        email,
        username,
        password: hashedPassword,
      });
      user.confirmed = true;
      await user.save();
      const response = await request(app)
        .post('/users/token')
        .send({
          email,
          password,
        });
      expect(response.status).toEqual(200);
    });
    it("should throw an error if user doesn't exist", async (): Promise<
      void
    > => {
      const wrongEmail = 'wrong@mail.com';
      const user = new User({
        email,
        username,
        password: hashedPassword,
      });
      user.confirmed = true;
      await user.save();
      const response = await request(app)
        .post('/users/token')
        .send({
          email: wrongEmail,
          password,
        });
      expect(response.status).toEqual(404);
    });
    it('should throw an error if password is incorrect', async (): Promise<
      void
    > => {
      const wrongPassword = 'wrong';
      const user = new User({
        email,
        username,
        password: hashedPassword,
      });
      user.confirmed = true;
      await user.save();
      const response = await request(app)
        .post('/users/token')
        .send({
          email,
          password: wrongPassword,
        });
      expect(response.status).toEqual(401);
    });
  });
  describe('/users/:token', (): void => {
    let userId: string;
    beforeEach(
      async (): Promise<void> => {
        const user = new User({
          email,
          username,
          password: hashedPassword,
        });
        await user.save();
        userId = user._id.toString();
      },
    );
    it('should confirm user', async (): Promise<void> => {
      const secret: any = process.env.SECRET;
      const token = jwt.sign(
        {
          email,
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );
      const response = await request(app).patch(`/users/${token}`);
      expect(response.status).toEqual(204);
    });
    it('should return 404 response', async (): Promise<void> => {
      const email = 'testMail@mail.com';
      const userId = mongoose.Types.ObjectId().toString();
      const secret: any = process.env.SECRET;
      const token = jwt.sign(
        {
          email,
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );
      const response = await request(app).post(`/users/${token}`);
      expect(response.status).toEqual(404);
    });
  });

  describe('patch /users/posts/:postId', (): void => {
    it('should save a post', async (): Promise<void> => {
      const postId = mongoose.Types.ObjectId().toString();
      const user = new User({
        email,
        username,
        password: hashedPassword,
      });

      await user.save();
      const userId = user._id;
      const secret: any = process.env.SECRET;
      const token = jwt.sign(
        {
          email,
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );
      const response = await request(app)
        .patch(`/users/posts/${postId}/save`)
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toEqual(204);
    });
    it('should remove a saved  post', async (): Promise<void> => {
      const postId = mongoose.Types.ObjectId().toString();
      const user = new User({
        email,
        username,
        password: hashedPassword,
      });
      user.savedPosts.push(postId);
      await user.save();
      const userId = user._id;
      const secret: any = process.env.SECRET;
      const token = jwt.sign(
        {
          email,
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );
      const response = await request(app)
        .patch(`/users/posts/${postId}/save`)
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toEqual(204);
    });
  });
  describe('patch /users/comments/:commentId', (): void => {
    it('should save a comment', async (): Promise<void> => {
      const commentId = mongoose.Types.ObjectId().toString();
      const user = new User({
        email,
        username,
        password: hashedPassword,
      });

      await user.save();
      const userId = user._id;
      const secret: any = process.env.SECRET;
      const token = jwt.sign(
        {
          email,
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );
      const response = await request(app)
        .patch(`/users/comments/${commentId}/save`)
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toEqual(204);
    });
    it('should remove a saved comment', async (): Promise<void> => {
      const commentId = mongoose.Types.ObjectId().toString();
      const user = new User({
        email,
        username,
        password: hashedPassword,
      });
      user.savedComments.push(commentId);
      await user.save();
      const userId = user._id;
      const secret: any = process.env.SECRET;
      const token = jwt.sign(
        {
          email,
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );
      const response = await request(app)
        .patch(`/users/comments/${commentId}/save`)
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toEqual(204);
    });
  });
  describe('patch /users/posts/:postId/vote', (): void => {
    let userId: string;
    let postId: string;
    const secret: any = process.env.SECRET;
    beforeEach(
      async (): Promise<void> => {
        const user = new User({
          email,
          username,
          password: hashedPassword,
        });
        await user.save();
        userId = user._id;
        const type = 'text';
        const title = 'test';
        const text = 'text';
        const post = new Post({
          type,
          title,
          text,
          community: mongoose.Types.ObjectId(),
          user: userId,
        });
        await post.save();
        postId = post._id;
      },
    );
    it('should upvote a post', async (): Promise<void> => {
      const type = 'upvote';
      const token = jwt.sign(
        {
          email,
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );
      const response = await request(app)
        .patch(`/users/posts/${postId}/vote?type=${type}`)
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toEqual(204);
    });
    it('should downvote a post', async (): Promise<void> => {
      const type = 'downvote';
      const token = jwt.sign(
        {
          email,
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );
      const response = await request(app)
        .patch(`/users/posts/${postId}/vote?type=${type}`)
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toEqual(204);
    });
  });
  describe('patch /users/comments/:commentId/vote', (): void => {
    let userId: string;
    let commentId: string;
    const secret: any = process.env.SECRET;
    beforeEach(
      async (): Promise<void> => {
        const user = new User({
          email,
          username,
          password: hashedPassword,
        });
        await user.save();
        userId = user._id;
        const text = 'text';
        const comment = new Comment({
          text,
          source: mongoose.Types.ObjectId(),
          onModel: 'Post',
          user: userId,
        });
        await comment.save();
        commentId = comment._id;
      },
    );
    it('should upvote a comment', async (): Promise<void> => {
      const type = 'upvote';
      const token = jwt.sign(
        {
          email,
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );
      const response = await request(app)
        .patch(`/users/comments/${commentId}/vote?type=${type}`)
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toEqual(204);
    });
    it('should downvote a comment', async (): Promise<void> => {
      const type = 'downvote';
      const token = jwt.sign(
        {
          email,
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );
      const response = await request(app)
        .patch(`/users/comments/${commentId}/vote?type=${type}`)
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toEqual(204);
    });
  });
  describe('patch /users/communities/:communityId', (): void => {
    let userId: string;
    const secret: any = process.env.SECRET;
    beforeEach(
      async (): Promise<void> => {
        const user = new User({
          email,
          username,
          password: hashedPassword,
        });
        await user.save();
        userId = user._id;
      },
    );
    it('should subscribe user to community', async (): Promise<void> => {
      const communityId = mongoose.Types.ObjectId().toString();
      const token = jwt.sign(
        {
          email,
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );
      const response = await request(app)
        .patch(`/users/communities/${communityId}`)
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toEqual(204);
    });
  });
});
