import comparePasswords from '../../utilities/comparePasswords';
import bcrypt from 'bcryptjs';
import { ErrorREST, Errors } from '../../classes/ErrorREST';
describe('comparePassword', (): void => {
  let password: string;
  let hashedPassword: string;
  beforeEach(
    async (): Promise<void> => {
      password = '12345678';
      hashedPassword = await bcrypt.hash(password, 12);
    },
  );
  it(`should throw an error if passwords don't match`, async (): Promise<
    void
  > => {
    const wrongPassword = 'wrong';
    const { status, message } = Errors.Unauthorized;
    const error = new ErrorREST(status, message, null);
    await expect(
      comparePasswords(wrongPassword, hashedPassword),
    ).rejects.toThrow(error);
  });
  it(`shouldn't throw an error if passwords match `, async (): Promise<
    void
  > => {
    await expect(comparePasswords(password, hashedPassword)).toEqual(
      Promise.resolve({}),
    );
  });
});
