import mongoose from 'mongoose';
const includesObjectId = (arr: string[], stringId: string): boolean => {
  const id = mongoose.Types.ObjectId(stringId);
  const check = arr.find(
    (stringItemId: string): boolean => {
      const itemId = mongoose.Types.ObjectId(stringItemId);
      return itemId.equals(id);
    },
  );
  return check ? true : false;
};

export default includesObjectId;
