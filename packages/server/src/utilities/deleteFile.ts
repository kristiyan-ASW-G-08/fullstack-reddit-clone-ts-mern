import fs from 'fs';
import { ErrorREST, Errors } from '../classes/ErrorREST';
const deleteFile = (fileUrl: string): void => {
  try {
    if (fileUrl) {
      fs.unlink(
        fileUrl,
        (err): void => {
          if (err) {
            const { status, message } = Errors.NotFound;
            const error = new ErrorREST(status, message, err);
            throw error;
          }
        },
      );
    }
  } catch (err) {
    throw err;
  }
};
export default deleteFile;
