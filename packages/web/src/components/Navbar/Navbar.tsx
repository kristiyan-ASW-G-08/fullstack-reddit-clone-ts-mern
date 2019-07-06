import React, { FC, useContext } from 'react';
import { Menu, Avatar } from 'antd';
import Dropdown from './Dropdown/Dropdown';
import SearchBar from './SearchBar/SearchBar';
import RootStoreContext from 'stores/RootStore/RootStore';
import Logo from 'assets/icon.svg';
import { observer } from 'mobx-react-lite';
const { Item } = Menu;

const Navbar: FC = observer(({ ...props }) => {
  const { authStore, themeStore, modalStore } = useContext(RootStoreContext);
  const toggleTheme = () => themeStore.toggleTheme();
  const loginModalHandler = () => modalStore.setModalState('login');
  const signUpModalHandler = () => modalStore.setModalState('signUp');
  const communityModalHandler = () => modalStore.setModalState('community');
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
          authState={authStore.authState}
          loginModalHandler={loginModalHandler}
          signUpModalHandler={signUpModalHandler}
          logOutHandler={() => authStore.resetAuthState()}
          communityModalHandler={communityModalHandler}
        />
      </Menu>
    </>
  );
});

export default Navbar;
