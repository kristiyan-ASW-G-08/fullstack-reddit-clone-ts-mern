import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Menu } from 'antd';
import Theme from '../../types/Theme';
const { Item } = Menu;
interface NavbarProps {
  theme: string | undefined;
}
const Navbar: FC<NavbarProps> = ({ theme }) => {
  return (
    <Menu
      theme={theme}
      mode="horizontal"
      defaultSelectedKeys={['2']}
      style={{ lineHeight: '64px' }}
    >
      <Item key="1">nav 1</Item>
      <Item key="2">nav 2</Item>
      <Item key="3">nav 3</Item>
    </Menu>
  );
};

export default Navbar;
