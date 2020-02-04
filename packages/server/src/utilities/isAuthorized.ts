import { ErrorREST, Errors } from './ErrorREST';
const isAuthorized = (authorizedUserId: string, userId: string): void => {
  if (authorizedUserId.toString() !== userId.toString()) {
    const { status, message } = Errors.Unauthorized;
    const error = new ErrorREST(status, message);
    throw error;
  }
};
export default isAuthorized;
