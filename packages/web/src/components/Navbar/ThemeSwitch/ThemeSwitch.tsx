import React, { FC, ReactNode } from 'react';
import { Switch } from 'antd';
interface ThemeSwitchProps {
  toggleTheme: () => void;
}
const ThemeSwitch: FC<ThemeSwitchProps> = ({ toggleTheme }) => {
  return (
    <Switch
      checkedChildren="Light"
      unCheckedChildren="Dark"
      defaultChecked
      onChange={toggleTheme}
      data-testid="theme-switch"
    />
  );
};

export default ThemeSwitch;
