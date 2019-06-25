import AuthStore from './AuthStore';
import defaultAuthState from './defaultAuthState';
import authenticatedAuthState from './authenticatedAuthState';
describe('AuthStore', (): void => {
  const authStore = new AuthStore();
  it('should be default', (): void => {
    expect(authStore.authState).toEqual(defaultAuthState);
  });
  it('should be authenticatedAuthState', (): void => {
    authStore.setAuthState(authenticatedAuthState);
    expect(authStore.authState).toEqual(authenticatedAuthState);
  });
  it('should be default', (): void => {
    authStore.resetAuthState();
    expect(authStore.authState).toEqual(defaultAuthState);
  });
});
