import User from '../../models/User';
import request from 'supertest';
import mongoose from 'mongoose';
import { mongoURI } from '../../config/db';
import bcrypt from 'bcryptjs';
import app from '../../app';
import sendConfirmationEmail from '../../utilities/sendConfirmationEmail';
import jwt from 'jsonwebtoken';
mongoose.connect(mongoURI, { useNewUrlParser: true });
const port = 8080;
jest.mock('../../services/sendConfirmationEmail');
describe('user routes', (): void => {
  beforeAll(
    async (): Promise<void> => {
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
      const username = 'test2UserName';
      const email = 'testMail@mail.com';
      const password = '1234567891011';
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
      const username = 'test2UserName';
      const email = 'testMail@mail.com';
      const password = '1234567891011';
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
      const username = 'test2UserName';
      const email = 'testMail@mail.com';
      const password = '1234567891011';
      const hashedPassword = await bcrypt.hash(password, 12);
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
      const username = 'test2UserName';
      const email = 'testMail@mail.com';
      const password = '1234567891011';
      const hashedPassword = await bcrypt.hash(password, 12);
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
      const username = 'test2UserName';
      const email = 'testMail@mail.com';
      const password = '1234567891011';
      const hashedPassword = await bcrypt.hash(password, 12);
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
    let email: string;
    beforeEach(
      async (): Promise<void> => {
        const username = 'test2UserName';
        email = 'testMail@mail.com';
        const password = '1234567891011';
        const hashedPassword = await bcrypt.hash(password, 12);
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
});
