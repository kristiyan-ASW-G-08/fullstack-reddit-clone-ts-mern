import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import ThemeSwitch from './ThemeSwitch';
describe('<ThemeSwitch />', () => {
  const toggleTheme = jest.fn();
  const { getByTestId } = render(<ThemeSwitch toggleTheme={toggleTheme} />);
  beforeEach(() => {
    const themeSwitch = getByTestId('theme-switch');
    fireEvent.click(themeSwitch);
  });
  afterEach(cleanup);

  it('should change input value', async () => {
    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });
});