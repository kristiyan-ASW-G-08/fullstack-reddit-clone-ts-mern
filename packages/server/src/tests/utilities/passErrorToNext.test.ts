import passErrorToNext from '../../utilities/passErrorToNext';
import { ErrorREST, Errors } from '../../utilities/ErrorREST';
describe('passErrorToNext', (): void => {
  it(`should call next once`, (): void => {
    const nextMock = jest.fn();
    const { status, message } = Errors.NotFound;
    const error = new ErrorREST(status, message);
    passErrorToNext(error, nextMock);
    expect(nextMock).toBeCalledTimes(1);
    expect(nextMock).toHaveBeenCalledWith(error);
  });
  '';
  it("should add status of 500 to error if it doesn't have one", (): void => {
    const nextMock = jest.fn();
    const error = new Error('test error');
    const { status, message } = Errors.InternalServerError;
    const expectedError = new ErrorREST(status, message, error);
    passErrorToNext(error, nextMock);
    expect(nextMock).toBeCalledTimes(1);
    expect(nextMock).toHaveBeenCalledWith(expectedError);
  });
});
