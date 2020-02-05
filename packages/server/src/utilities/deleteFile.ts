import fs from 'fs';
import { RESTError, errors } from '@utilities/RESTError';
import getFilePath from '@utilities/getFilePath';

const deleteFile = async (filePath: string): Promise<void> => {
  try {
    await fs.promises.unlink(getFilePath(filePath));
  } catch (err) {
    const { status, message } = errors.NotFound;
    throw new RESTError(status, message);
  }
};
export default deleteFile;
