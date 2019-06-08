import {
  createUser,
  getUserByEmail,
  getUserById,
  authenticateUser,
} from '../../services/userServices';
import User from '../../models/User';
import UserType from '../../types/User';
import { ErrorREST, Errors } from '../../classes/ErrorREST';
import mongoose from 'mongoose';
import { mongoURI } from '../../config/db';
import bcrypt from 'bcryptjs';
describe('userServices', (): void => {
  beforeAll(
    async (): Promise<void> => {
      mongoose.connect(mongoURI, { useNewUrlParser: true });
      await User.deleteMany({}).exec();
    },
  );
  beforeEach(
    async (): Promise<void> => {
      await User.deleteMany({});
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
  describe('createUser', (): void => {
    it(`should create new user`, async (): Promise<void> => {
      const email = 'newEmail@mail.com';
      const username = 'username';
      const password = 'password';
      const { userId } = await createUser(email, username, password);
      expect(userId).toBeTruthy();
      const user = await User.findById(userId);
      if (!user) {
        return;
      }
      expect(user.email).toMatch(email);
      expect(user.username).toMatch(username);
    });
  });
  describe('getUserByEmail', (): void => {
    it(`should return a user`, async (): Promise<void> => {
      const email = 'newEmail@mail.com';
      const username = 'username';
      const password = 'password';
      const newUser = new User({
        email,
        password,
        username,
      });
      await newUser.save();
      const user = await getUserByEmail(email);
      if (!user) {
        return;
      }
      expect(user.email).toMatch(email);
      expect(user.username).toMatch(username);
    });

    it(`shouldn't throw an error if user isn't found`, async (): Promise<
      void
    > => {
      const email = 'newEmail@mail.com';
      const { status, message } = Errors.NotFound;
      const error = new ErrorREST(status, message, null);
      await expect(getUserByEmail(email)).rejects.toThrow(error);
    });
  });
  describe('getUserById', (): void => {
    it(`should return a user`, async (): Promise<void> => {
      const email = 'newEmail@mail.com';
      const username = 'username';
      const password = 'password';
      const newUser = new User({
        email,
        password,
        username,
      });
      await newUser.save();
      const { _id } = newUser;

      const user = await getUserById(_id);
      if (!user) {
        return;
      }
      expect(user.email).toMatch(email);
      expect(user.username).toMatch(username);
    });

    it(`shouldn't throw an error if user isn't found`, async (): Promise<
      void
    > => {
      const id = mongoose.Types.ObjectId().toString();
      const { status, message } = Errors.NotFound;
      const error = new ErrorREST(status, message, null);
      await expect(getUserById(id)).rejects.toThrow(error);
    });
  });
  describe('getUserByEmail', (): void => {
    it(`should return a user`, async (): Promise<void> => {
      const email = 'newEmail@mail.com';
      const username = 'username';
      const password = 'password';
      const newUser = new User({
        email,
        password,
        username,
      });
      await newUser.save();
      const user = await getUserByEmail(email);
      if (!user) {
        return;
      }
      expect(user.email).toMatch(email);
      expect(user.username).toMatch(username);
    });

    it(`shouldn't throw an error if user isn't found`, async (): Promise<
      void
    > => {
      const email = 'newEmail@mail.com';
      const { status, message } = Errors.NotFound;
      const error = new ErrorREST(status, message, null);
      await expect(getUserByEmail(email)).rejects.toThrow(error);
    });
  });
  describe('authenticateUser', (): void => {
    let newUser: UserType;
    let email: string;
    let password: string;
    let username: string;
    beforeEach(
      async (): Promise<void> => {
        email = 'newEmail@mail.com';
        username = 'username';
        password = 'password';
        const hashedPassword = await bcrypt.hash(password, 12);
        newUser = new User({
          email,
          password: hashedPassword,
          username,
        });
        await newUser.confirm();
      },
    );
    it(`should return a token and userData`, async (): Promise<void> => {
      const { token, userData } = await authenticateUser(newUser, password);
      expect(token).toBeTruthy();
      expect(typeof token).toMatch('string');
      expect(userData.username).toMatch(username);
      expect(userData.email).toMatch(email);
      expect(userData.userId).toMatch(newUser._id.toString());
    });
    it(`shouldn't throw an error if the passwords don't match`, async (): Promise<
      void
    > => {
      const wrongPassword = 'wrong';
      const { status, message } = Errors.Unauthorized;
      const error = new ErrorREST(status, message, null);
      await expect(authenticateUser(newUser, wrongPassword)).rejects.toThrow(
        error,
      );
    });
  });
});
