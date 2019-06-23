import { createContext } from 'react';
import { observable, action } from 'mobx';
import { persist } from 'mobx-persist';
class ThemeStore {
  @persist @observable public theme: 'light' | 'dark' | undefined = 'light';

  @action public toggleTheme(): void {
    console.log(this.theme);
    this.theme = this.theme === 'light' ? 'dark' : 'light';
  }
}

const ThemeStoreContext = createContext(new ThemeStore());
export { ThemeStoreContext };
export default ThemeStore;
