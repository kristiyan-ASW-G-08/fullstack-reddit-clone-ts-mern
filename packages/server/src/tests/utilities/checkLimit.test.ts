import checkLimit from '../../utilities/checkLimit';
describe('checkLimit', (): void => {
  it("shouldn't throw an error", (): void => {
    expect((): void => checkLimit(1)).not.toThrow();
    expect((): void => checkLimit(50)).not.toThrow();
    expect((): void => checkLimit(25)).not.toThrow();
  });
  it(`should throw an error`, (): void => {
    expect((): void => checkLimit(51)).toThrowErrorMatchingSnapshot();
    expect((): void => checkLimit(0)).toThrowErrorMatchingSnapshot();
  });
});
