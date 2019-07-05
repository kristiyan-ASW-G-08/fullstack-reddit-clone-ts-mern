import React from 'react';
import {
  render,
  fireEvent,
  cleanup,
  waitForElement,
} from '@testing-library/react';
import ThemeSwitch from './ThemeSwitch';
describe('<ThemeSwitch />', () => {
  const toggleTheme = jest.fn();
  const { container, getByTestId } = render(
    <ThemeSwitch toggleTheme={toggleTheme} />,
  );
  beforeEach(async () => {
    const themeSwitch = await waitForElement(() => getByTestId('theme-switch'));
    fireEvent.click(themeSwitch);
  });
  afterEach(cleanup);

  it('snapshot', () => {
    expect(container).toMatchSnapshot();
  });
  it('should call toggleTheme once', async () => {
    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });
});
