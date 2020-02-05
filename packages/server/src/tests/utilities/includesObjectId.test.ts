import includesObjectId from '../../utilities/includesId';
import mongoose from 'mongoose';
describe('includesObjectId', (): void => {
  const id = mongoose.Types.ObjectId().toString();
  const idArr = [
    mongoose.Types.ObjectId().toString(),
    mongoose.Types.ObjectId().toString(),
    mongoose.Types.ObjectId().toString(),
  ];
  it(`should return true`, (): void => {
    const newIdArr = [...idArr, id];
    expect(includesObjectId(newIdArr, id)).toBeTruthy();
  });
  it(`should return false `, (): void => {
    const newIdArr = [...idArr, id];
    expect(includesObjectId(newIdArr, id)).toBeTruthy();
  });
});
