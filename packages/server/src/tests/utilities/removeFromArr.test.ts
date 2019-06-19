import removeFromArr from '../../utilities/removeFromArr';
import mongoose from 'mongoose';
describe('removeFromArr', (): void => {
  const id = mongoose.Types.ObjectId().toString();
  const idArr = [
    mongoose.Types.ObjectId().toString(),
    mongoose.Types.ObjectId().toString(),
    mongoose.Types.ObjectId().toString(),
  ];
  it(`should return true`, (): void => {
    const newIdArr = [...idArr, id];
    const removedIdArr = removeFromArr(newIdArr, id);
    expect(removedIdArr).toHaveLength(3);
    expect(removedIdArr).toEqual(idArr);
  });
});
