import mongoose from 'mongoose';
import includesId from '../includesId';

describe('includesId', () => {
  const id = mongoose.Types.ObjectId();
  const stringId = id.toString();
  const idArr = [
    mongoose.Types.ObjectId(),
    mongoose.Types.ObjectId(),
    mongoose.Types.ObjectId(),
  ];
  it(`should return true if the array includes the objectId`, () => {
    const newIdArr = [...idArr, id];
    expect(includesId(newIdArr, stringId)).toBeTruthy();
  });
  it(`should return false if the array doesn't include the objectId`, () => {
    const newIdArr = [...idArr];
    expect(includesId(newIdArr, stringId)).toBeFalsy();
  });
});
