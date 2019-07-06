import React, { FC, ReactNode } from 'react';
import { Menu, Icon, Switch, Button, Avatar, Typography } from 'antd';
import AuthState from 'types/AuthState';
import ThemeSwitch from '../ThemeSwitch/ThemeSwitch';
const { SubMenu, Item } = Menu;
const { Text } = Typography;
interface DropdownProps {
  toggleTheme: () => void;
  authState: AuthState;
  loginModalHandler: () => void;
  signUpModalHandler: () => void;
  logOutHandler: () => void;
  communityModalHandler: () => void;
}
const Dropdown: FC<DropdownProps> = ({
  toggleTheme,
  authState,
  signUpModalHandler,
  loginModalHandler,
  communityModalHandler,
  logOutHandler,
  ...props
}) => {
  const { isAuth, user } = authState;
  return (
    <>
      <SubMenu
        {...props}
        key="sub1"
        title={
          isAuth ? (
            <div>
              <Avatar
                style={{ marginRight: '0.5rem' }}
                size="small"
                icon="user"
                src={`http://localhost:8080/images/${user.avatar}`}
              />
              <Icon type="caret-down" />
            </div>
          ) : (
            <span>
              <Icon type="user" />
              <Icon type="caret-down" />
            </span>
          )
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
