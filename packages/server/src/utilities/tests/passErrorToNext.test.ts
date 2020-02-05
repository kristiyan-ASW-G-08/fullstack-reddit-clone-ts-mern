import passErrorToNext from '@utilities/passErrorToNext';
import RESTError, { errors } from '@utilities/RESTError';
import ValidationError from '@twtr/common/source/types/ValidationError';

jest.mock('@utilities/RESTError');

const RESTErrorMock = RESTError as jest.MockedClass<typeof RESTError>;

describe('passErrorToNext', () => {
  afterEach(() => jest.clearAllMocks());
  afterAll(() => jest.restoreAllMocks());
  it(`should call next with the passed error if it has a status code`, () => {
    expect.assertions(2);
    RESTErrorMock.mockImplementation(
      (status: number, message: string, data?: ValidationError[] | string) => ({
        status,
        message,
        data,
        name: 'error',
      }),
    );

    const nextMock = jest.fn();
    const { status, message } = errors.NotFound;
    const error = new RESTError(status, message);

    passErrorToNext(error, nextMock);

    expect(nextMock).toHaveBeenCalledTimes(1);
    expect(nextMock).toHaveBeenCalledWith(error);
  });
  it(`should call next with new RESTError if the passed error doesn't have a status code`, () => {
    expect.assertions(2);
    RESTErrorMock.mockImplementation(
      (status: number, message: string, data?: ValidationError[] | string) => ({
        status,
        message,
        data,
        name: 'error',
      }),
    );

    const nextMock = jest.fn();
    const { status, message } = errors.InternalServerError;
    const error = new Error('Message');
    // @ts-ignore
    const restError = new RESTError(status, message, error);

    passErrorToNext(error, nextMock);

    expect(nextMock).toHaveBeenCalledTimes(1);
    expect(nextMock).toHaveBeenCalledWith(restError);
  });
});
