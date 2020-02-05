import RESTError, { errors } from '@utilities/RESTError';

const hasConfirmedEmail = (isConfirmed: boolean): void => {
  if (!isConfirmed) {
    const { status, message } = errors.Unauthorized;
    throw new RESTError(status, message, [
      {
        path: 'email',
        message: 'Confirm your email to proceed',
      },
    ]);
  }
};

export default hasConfirmedEmail;
