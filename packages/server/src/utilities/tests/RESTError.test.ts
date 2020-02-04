import { RESTError, errors } from '@utilities/RESTError';

describe('CustomError', () => {
  const errorData = 'ErrorData';
  it.each(Object.values(errors))(
    'RESTError should have the correct status, message, and error data',
    ({ status, message }) => {
      expect.assertions(4);

      const error = new RESTError(status, message, errorData);

      expect(error).toBeInstanceOf(RESTError);
      expect(error.status).toBe(status);
      expect(error.message).toMatch(message);
      expect(error.data).toMatch(errorData);
    },
  );
});
