import mongoose from 'mongoose';
const removeFromArr = (itemsArr: string[], stringId: string): string[] => {
  const id = mongoose.Types.ObjectId(stringId);
  const filteredItemsArr = itemsArr.filter(
    (stringItemId: string): boolean => {
      const itemId = mongoose.Types.ObjectId(stringItemId);
      return !itemId.equals(id);
    },
  );
  return filteredItemsArr;
};

export default removeFromArr;
