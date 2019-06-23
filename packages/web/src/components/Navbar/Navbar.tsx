import React, { FC, useState } from 'react';
import { Menu } from 'antd';
import Dropdown from './Dropdown/Dropdown';
import SearchBar from './SearchBar/SearchBar';
const { Item } = Menu;
interface NavbarProps {
  theme: 'light' | 'dark' | undefined;
  toggleTheme: () => void;
}
const Navbar: FC<NavbarProps> = ({ toggleTheme, theme, ...props }) => {
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
