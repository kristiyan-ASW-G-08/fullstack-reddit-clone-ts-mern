import React, { FC, ReactNode } from 'react';
import { Menu, Icon, Switch, Button } from 'antd';
import ThemeSwitch from '../ThemeSwitch/ThemeSwitch';
const { SubMenu, Item } = Menu;
interface DropdownProps {
  toggleTheme: () => void;
  isAuth: boolean;
  loginModalHandler: () => void;
  signUpModalHandler: () => void;
  logOutHandler: () => void;
  communityModalHandler: () => void;
}
const Dropdown: FC<DropdownProps> = ({
  toggleTheme,
  isAuth,
  signUpModalHandler,
  loginModalHandler,
  communityModalHandler,
  logOutHandler,
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
        {isAuth
          ? [
              <Item key="5" onClick={logOutHandler}>
                Log Out
              </Item>,
              <Item key="6" onClick={communityModalHandler}>
                Create Community
              </Item>,
            ]
          : [
              //Fragments break antd  so im using array instead
              <Item onClick={loginModalHandler} key="7">
                Log In
              </Item>,
              <Item onClick={signUpModalHandler} key="8">
                Sign In
              </Item>,
            ]}
        <Item>
          <ThemeSwitch toggleTheme={toggleTheme} />
        </Item>
      </SubMenu>
    </>
  );
};

export default Dropdown;
