import checkUserConfirmation from '../../utilities/checkUserConfirmation';
import User from '../../users/User';
import { ErrorREST, Errors } from '../../utilities/ErrorREST';
import mongoose from 'mongoose';
import { mongoURI } from '../../config/db';
mongoose.connect(mongoURI, { useNewUrlParser: true });
describe('checkUserConfirmation', (): void => {
  beforeEach(
    async (): Promise<void> => {
      await User.deleteMany({});
    },
  );
  afterEach(
    async (): Promise<void> => {
      await User.deleteMany({});
    },
  );
  afterAll(
    async (): Promise<void> => {
      await mongoose.connection.close();
    },
  );
  it(`should throw an error if user isn't confirmed`, async (): Promise<
    void
  > => {
    const email = 'newEmail@mail.com';
    const username = 'username';
    const password = 'password';
    const user = new User({
      email,
      password,
      username,
    });
    await user.save();
    const { status, message } = Errors.Unauthorized;
    const error = new ErrorREST(status, message, null);
    await expect(checkUserConfirmation(user)).rejects.toThrow(error);
  });
  it(`shouldn't throw an error if user is confirmed`, async (): Promise<
    void
  > => {
    const email = 'newEmail@mail.com';
    const username = 'username';
    const password = 'password';
    const user = new User({
      email,
      password,
      username,
    });
    user.confirmed = true;
    await user.save();
    await expect(checkUserConfirmation(user)).toEqual(Promise.resolve({}));
  });
});
