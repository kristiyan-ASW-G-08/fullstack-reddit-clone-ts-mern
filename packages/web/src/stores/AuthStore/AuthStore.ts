import { createContext } from 'react';
import { observable, action } from 'mobx';
import { persist, create } from 'mobx-persist';
import AuthState from 'types/AuthState';
import defaultAuthState from './defaultAuthState';

class AuthStore {
  @persist('object') @observable public authState: AuthState = defaultAuthState;
  @action public setAuthState(newAuthState: AuthState): void {
    this.authState = newAuthState;
  }
  @action public resetAuthState(): void {
    console.log('reset');
    this.authState = defaultAuthState;
  }
}
export default AuthStore;
