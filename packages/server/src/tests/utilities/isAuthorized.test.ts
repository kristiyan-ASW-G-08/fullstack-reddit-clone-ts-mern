import isAuthorized from '../../utilities/isAuthorized';
import { ErrorREST, Errors } from '../../utilities/ErrorREST';
describe('isAuthorized', (): void => {
  const authorizedUserId = 'authorizedUserId';
  const userId = 'userId';
  it(`should throw an error if id's don't match`, async (): Promise<void> => {
    const { status, message } = Errors.Unauthorized;
    const error = new ErrorREST(status, message, null);
    expect(() => isAuthorized(authorizedUserId, userId)).toThrow(error);
  });
  it(`shouldn't throw an error if passwords match `, async (): Promise<
    void
  > => {
    await expect(() =>
      isAuthorized(authorizedUserId, authorizedUserId),
    ).not.toThrow();
  });
});
