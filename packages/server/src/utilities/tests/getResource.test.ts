import RESTError from '@utilities/RESTError';
import User from '@users/User';
import UserType from '@customTypes/User';
import getResource from '@utilities/getResource';
import ValidationError from '@rddt/common/source/types/ValidationError';

jest.mock('@utilities/RESTError');

//@ts-ignore
const RESTErrorMock = RESTError as jest.MockedClass<typeof RESTError>;

describe('getResource', () => {
  expect.assertions(5);
  afterEach(() => jest.clearAllMocks());
  afterAll(() => jest.restoreAllMocks());

  it('should call find and select', async () => {
    const select = jest.fn(() => true);
    const findQuery = { name: 'email', value: 'testMail@test' };
    const selectQuery = 'username email';
    const findOneSpy = jest
      .spyOn(User, 'findOne')
      // @ts-ignore
      .mockReturnValue({ select });
    await getResource<UserType>(User, findQuery, selectQuery);

    expect(findOneSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).toHaveBeenCalledWith({
      [findQuery.name]: findQuery.value,
    });
    expect(select).toHaveBeenCalledTimes(1);
    expect(select).toHaveBeenCalledWith(selectQuery);
    expect(RESTErrorMock).not.toHaveBeenCalled();
  });
  it('should throw an error if find and select resolve to falsy value', async () => {
    expect.assertions(2);
    const select = jest.fn(() => false);
    const findQuery = { name: 'email', value: 'testMail@test' };
    const selectQuery = 'username email';
    const findOneSpy = jest
      .spyOn(User, 'findOne')
      // @ts-ignore
      .mockReturnValue({ select });

    RESTErrorMock.mockImplementation(
      (status: number, message: string, data?: ValidationError[] | string) => ({
        status,
        message,
        data,
        name: 'error',
      }),
    );

    await expect(
      getResource<UserType>(User, findQuery, selectQuery),
    ).rejects.toThrowErrorMatchingSnapshot();
    expect(RESTErrorMock).toHaveBeenCalledTimes(1);
  });
});
