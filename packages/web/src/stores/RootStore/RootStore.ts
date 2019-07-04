import { create } from 'mobx-persist';
import { createContext } from 'react';
import AuthStore from 'stores/AuthStore/AuthStore';
import ThemeStore from 'stores/ThemeStore/ThemeStore';
import ModalStore from 'stores/ModalStore/ModalStore';
import { reaction, observable } from 'mobx';
const hydrate = create({
  storage: localStorage,
  jsonify: true,
});
export class RootStore {
  public authStore = new AuthStore();
  public themeStore = new ThemeStore();
  public modalStore = new ModalStore();
  public constructor() {
    hydrate('authStore', this.authStore);
    hydrate('themeStore', this.themeStore);

    const lsAuthStore = localStorage.getItem('authStore');
    const { authState } = JSON.parse(lsAuthStore || '');
    if (authState) {
      const { expiryDate } = authState;
      if (new Date(expiryDate) <= new Date()) {
        this.authStore.resetAuthState();
      }
    }
  }
}

const RootStoreContext = createContext(new RootStore());
export default RootStoreContext;
