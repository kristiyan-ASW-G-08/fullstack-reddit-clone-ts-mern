import isAuthorized from '@utilities/isAuthorized';
import mongoose from 'mongoose';

describe('isAuthorized', () => {
  const authorizedUserId = mongoose.Types.ObjectId().toString();
  const userId = mongoose.Types.ObjectId().toString();
  it(`should throw an error when the ids don't match`, async () => {
    expect.assertions(2);
    expect((): void => isAuthorized(authorizedUserId, userId)).toThrow();
    expect((): void =>
      isAuthorized(authorizedUserId, userId),
    ).toMatchInlineSnapshot(`[Function]`);
  });
  it(`shouldn't throw an error when the ids match`, async () => {
    expect.assertions(1);
    expect(() =>
      isAuthorized(authorizedUserId, authorizedUserId),
    ).not.toThrow();
  });
});
