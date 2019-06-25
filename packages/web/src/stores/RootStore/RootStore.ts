import { create } from 'mobx-persist';
import { createContext } from 'react';
import AuthStore from '../AuthStore/AuthStore';
import ThemeStore from '../ThemeStore/ThemeStore';
import ModalStore from '../ModalStore/ModalStore';
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
  }
}

const RootStoreContext = createContext(new RootStore());
export default RootStoreContext;
