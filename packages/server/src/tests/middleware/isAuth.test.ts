import isAuth from '../../middleware/isAuth';
import { Request, Response, NextFunction } from 'express';
import httpMocks from 'node-mocks-http';
import jwt from 'jsonwebtoken';
import { ErrorREST, Errors } from '../../classes/ErrorREST';
describe('isAuth', (): void => {
  const authorizedUserId = 'authorizedUserId';
  const userId = 'userId';
  it(`should add userId to req`, async (): Promise<void> => {
    const nextMock = jest.fn();
    const userId = 'randomUserId';
    const secret: any = process.env.SECRET;
    const token = jwt.sign(
      {
        userId,
      },
      secret,
      { expiresIn: '1h' },
    );
    const reqMock = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    const resMock = httpMocks.createResponse();
    isAuth(reqMock, resMock, nextMock);
    expect(nextMock).toBeCalledTimes(1);
    expect(reqMock.userId).toEqual(userId);
  });
  //   it("should throw an error if req doesn't have Authorization header", async (): Promise<
  //     void
  //   > => {
  //     const nextMock = jest.fn();
  //     const reqMock = httpMocks.createRequest({
  //       method: 'POST',
  //       url: '/',
  //     });
  //     const resMock = httpMocks.createResponse();
  //     const { status, message } = Errors.Unauthorized;
  //     const error = new ErrorREST(status, message, null);
  //     expect(isAuth(reqMock, resMock, nextMock)).toThrow(error);
  //   });
});
