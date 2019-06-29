import React, { FC, ReactNode } from 'react';
import { Menu, Icon, Switch, Button } from 'antd';
import ThemeSwitch from '../ThemeSwitch/ThemeSwitch';
import { observer } from 'mobx-react-lite';
const { SubMenu, Item } = Menu;
interface DropdownProps {
  toggleTheme: () => void;
  isAuth: boolean;
  loginModalHandler: () => void;
  signUpModalHandler: () => void;
}
const Dropdown: FC<DropdownProps> = observer(
  ({
    toggleTheme,
    isAuth,
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
          {isAuth ? (
            <Item key="5">Log Out</Item>
          ) : (
            [
              //Fragments break antd  so im using array instead
              <Item onClick={() => loginModalHandler()} key="6">
                Log In
              </Item>,
              <Item onClick={() => signUpModalHandler()} key="7">
                Sign In
              </Item>,
            ]
          )}
          <Item>
            <ThemeSwitch toggleTheme={toggleTheme} />
          </Item>
        </SubMenu>
      </>
    );
  },
);

export default Dropdown;
