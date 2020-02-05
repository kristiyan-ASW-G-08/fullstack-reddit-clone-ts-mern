import hasConfirmedEmail from '@utilities/hasConfirmedEmail';

describe('hasConfirmedEmail', () => {
  it('should throw an error when the passes value is truthy', async (): Promise<
    void
  > => {
    expect(() => hasConfirmedEmail(true)).not.toThrow();
  });
  it('should throw an error when the passed value is falsy', async (): Promise<
    void
  > => {
    expect(() => hasConfirmedEmail(false)).toThrowErrorMatchingSnapshot();
  });
});
