import React, { FC, Suspense, useContext, lazy } from 'react';
import RootStoreContext from 'stores/RootStore/RootStore';
import { observer } from 'mobx-react-lite';
import styles from './Home.module.scss';
import { Select, Tabs } from 'antd';
import Loader from 'components/Loader';
import PopularTabPane from './PopularTabPane';
import SideBar from './SideBar';
const UserFeedTabPane = lazy(() => import('./UserFeedTabPane'));
const { Option } = Select;
const { TabPane } = Tabs;

const Home: FC = observer(() => {
  const { authStore, modalStore } = useContext(RootStoreContext);
  const { isAuth, token } = authStore.authState;
  const openCommunityFormHandler = () => {
    if (isAuth) {
      modalStore.setModalState('community');
    } else {
      modalStore.setModalState('login');
    }
  };
  return (
    <div className={styles.grid}>
      <aside className={styles.sidebar}>
        <SideBar openCommunityFormHandler={openCommunityFormHandler} />
      </aside>
      <section className={styles.mainSection}>
        <>
          <Tabs defaultActiveKey="1" tabBarStyle={{ textAlign: 'center' }}>
            {isAuth ? (
              <TabPane tab={`Home`} key={'1'}>
                <Suspense fallback={<Loader />}>
                  <UserFeedTabPane />
                </Suspense>
              </TabPane>
            ) : (
              ''
            )}
            <TabPane tab={`Popular`} key={`${isAuth ? '2' : '1'}`}>
              <PopularTabPane />
            </TabPane>
          </Tabs>
        </>
      </section>
    </div>
  );
});
export default Home;
