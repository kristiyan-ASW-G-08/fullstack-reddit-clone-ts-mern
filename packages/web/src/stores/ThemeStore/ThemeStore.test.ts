import ThemeStore from './ThemeStore';
describe('ThemeStore', (): void => {
  it('should be light', (): void => {
    const themeStore = new ThemeStore();
    expect(themeStore.theme).toMatch('light');
  });
  it('should be dark', (): void => {
    const themeStore = new ThemeStore();
    expect(themeStore.theme).toMatch('light');
    themeStore.toggleTheme();
    expect(themeStore.theme).toMatch('dark');
  });
  it('should be light', (): void => {
    const themeStore = new ThemeStore();
    expect(themeStore.theme).toMatch('light');
    themeStore.toggleTheme();
    expect(themeStore.theme).toMatch('dark');
    themeStore.toggleTheme();
    expect(themeStore.theme).toMatch('light');
  });
});
