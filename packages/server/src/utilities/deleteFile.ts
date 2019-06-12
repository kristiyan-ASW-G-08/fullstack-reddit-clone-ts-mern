import fs from 'fs';
const deleteFile = (fileUrl: string): void => {
  if (fileUrl) {
    fs.unlink(
      fileUrl,
      (err): void => {
        if (err) {
          throw err;
        }
      },
    );
  }
};
export default deleteFile;
