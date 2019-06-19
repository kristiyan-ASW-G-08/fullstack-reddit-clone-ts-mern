import { ErrorREST, Errors } from '../classes/ErrorREST';
const isEmpty = (validationResult: any): void => {
  const errors = validationResult;
  if (!errors.isEmpty()) {
    const errorData = errors.array();
    const { status, message } = Errors.BadRequest;
    const error = new ErrorREST(status, message, errorData);
    throw error;
  }
};
export default isEmpty;
