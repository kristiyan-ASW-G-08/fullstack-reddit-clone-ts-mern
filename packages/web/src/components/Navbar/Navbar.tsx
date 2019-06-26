import React, { FC, useState } from 'react';
import { Menu, Avatar } from 'antd';
import Dropdown from './Dropdown/Dropdown';
import AuthState from '../../types/AuthState';
import ModalState from '../../types/ModalState';
import SearchBar from './SearchBar/SearchBar';
import Logo from '../../assets/icon.svg';
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
        style={{ lineHeight: '64px', textAlign: 'center' }}
      >
        <Item>
          <Avatar size="small" src={Logo} alt={`logo`} />
        </Item>
        <Item>
          <SearchBar />
        </Item>
        <Dropdown
          toggleTheme={toggleTheme}
          {...props}
          loginModalHandler={() => loginModalHandler()}
          signUpModalHandler={() => signUpModalHandler()}
        />
      </Menu>
    </>
  );
};

export default Navbar;
