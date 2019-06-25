import React, { FC, useState } from 'react';
import { Menu } from 'antd';
import Dropdown from './Dropdown/Dropdown';
import AuthState from '../../types/AuthState';
import ModalState from '../../types/ModalState';
import SearchBar from './SearchBar/SearchBar';
const { Item } = Menu;
interface NavbarProps {
  authState: AuthState;
  theme: 'light' | 'dark' | undefined;
  toggleTheme: () => void;
  loginModalHandler: () => void;
  signUpModalHandler: () => void;
}
const Navbar: FC<NavbarProps> = ({
  authState,
  toggleTheme,
  theme,
  signUpModalHandler,
  loginModalHandler,
  ...props
}) => {
  return (
    <>
      <Menu
        theme={theme}
        mode="horizontal"
        defaultSelectedKeys={['2']}
        style={{ lineHeight: '64px' }}
      >
        <Item>
          {' '}
          <SearchBar />
        </Item>

        <Dropdown toggleTheme={toggleTheme} {...props} />
      </Menu>
    </>
  );
};

export default Navbar;
