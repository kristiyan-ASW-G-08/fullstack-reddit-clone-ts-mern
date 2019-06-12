import { ErrorREST, Errors } from '../classes/ErrorREST';
const isAuthorized = (authorizedUserId: string, userId: string): void => {
  if (authorizedUserId !== userId) {
    const { status, message } = Errors.Unauthorized;
    const error = new ErrorREST(status, message, null);
    throw error;
  }
};
export default isAuthorized;
