import React, { FC, useContext } from 'react';
import { Menu, Avatar } from 'antd';
import Dropdown from './Dropdown/Dropdown';
import SearchBar from './SearchBar/SearchBar';
import RootStoreContext from '../../stores/RootStore/RootStore';
import Logo from '../../assets/icon.svg';
import { observer } from 'mobx-react-lite';
const { Item } = Menu;

const Navbar: FC = observer(({ ...props }) => {
  const { authStore, themeStore, modalStore } = useContext(RootStoreContext);
  const { isAuth } = authStore.authState;
  const toggleTheme = () => themeStore.toggleTheme();
  const loginModalHandler = () => modalStore.setModalState('login');
  const signUpModalHandler = () => modalStore.setModalState('signUp');
  return (
    <>
      <Menu
        theme={themeStore.theme}
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
          isAuth={isAuth}
          loginModalHandler={() => loginModalHandler()}
          signUpModalHandler={() => signUpModalHandler()}
        />
      </Menu>
    </>
  );
});

export default Navbar;
