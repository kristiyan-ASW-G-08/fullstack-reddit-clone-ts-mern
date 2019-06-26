import React, { FC, ReactNode } from 'react';
import { Menu, Icon, Switch, Button } from 'antd';
import ThemeSwitch from '../ThemeSwitch/ThemeSwitch';
const { SubMenu, Item } = Menu;
interface DropdownProps {
  toggleTheme: () => void;
  loginModalHandler: () => void;
  signUpModalHandler: () => void;
}
const Dropdown: FC<DropdownProps> = ({
  toggleTheme,
  signUpModalHandler,
  loginModalHandler,
  ...props
}) => {
  return (
    <>
      <SubMenu
        {...props}
        key="sub1"
        title={
          <span>
            <Icon type="user" />
            <Icon type="caret-down" />
          </span>
        }
      >
        <Item key="5">Option 5</Item>
        <Item key="6">Login</Item>
        <Item onClick={() => signUpModalHandler()} key="7">
          Sign In
        </Item>
        <Item>
          <ThemeSwitch toggleTheme={toggleTheme} />
        </Item>
      </SubMenu>
    </>
  );
};

export default Dropdown;
