import React, { FC, useState, useEffect, Suspense, useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Community from '@rddt/common/types/Community';
import Rule from '@rddt/common/types/Rule';
import Link from '@rddt/common/types/Link';
import axios, { AxiosResponse } from 'axios';
import Loader from 'components/Loader';
import styles from './CommunityPage.module.scss';
import PopulatedPost from '@rddt/common/types/PopulatedPost';
import PostsContainer from 'components/Post/PostsContainer/PostsContainer';
import CommunityDetails from './CommunityDetails/CommunityDetails';
import RulesContainer from './RulesContainer/RulesContainer';
import RootStoreContext from 'stores/RootStore/RootStore';
import { Tabs, Select } from 'antd';
const { TabPane } = Tabs;
const { Option } = Select;
interface MatchParams {
  communityId: string;
}

const CommunityPage: FC<RouteComponentProps<MatchParams>> = ({ match }) => {
  const { authStore } = useContext(RootStoreContext);
  const [community, setCommunity] = useState<Community>();
  const [rules, setRules] = useState<Rule[]>();
  const [posts, setPosts] = useState<PopulatedPost[]>();
  const { communityId } = match.params;
  const { token, isAuth } = authStore.authState;
  const getRelated = async () => {
    await Promise.all<AxiosResponse[]>([
      axios.get(`http://localhost:8080/communities/${communityId}/rules`),
      axios.get(
        `http://localhost:8080/communities/${communityId}/posts?sort=new`,
      ),
    ]).then(([rulesResponse, postsResponse]: any) => {
      setRules(rulesResponse.data.data.rules);
      setPosts(postsResponse.data.data.posts);
    });
  };
  useEffect(() => {
    axios
      .get(`http://localhost:8080/communities/${communityId}`)
      .then(request => {
        setCommunity(request.data.data.community);
        getRelated();
      })
      .catch(err => {
        console.log(err);
      });
  }, [communityId]);
  const sortPostsHandler = async (sortType: string) => {
    try {
      console.log(sortType);
      const request = await axios.get(
        `http://localhost:8080/communities/${communityId}/posts?sort=${sortType}`,
      );
      console.log(request.data.data);
      const { posts } = request.data.data;
      setPosts(posts);
    } catch (err) {
      console.log(err);
    }
  };
  const addPostComponentHandler = (post: PopulatedPost) => {
    if (posts) {
      const editedPosts = posts.filter(oldPost => oldPost._id !== post._id);
      setPosts([...editedPosts, post]);
    }
  };
  const removePostComponentHandler = (postId: String) => {
    if (posts) {
      const editedPosts = posts.filter(post => post._id !== postId);
      setPosts([...editedPosts]);
    }
  };

  return (
    <>
      {community ? (
        <Suspense fallback={<Loader />}>
          <div className={styles.grid}>
            <aside className={styles.sidebar}>
              <Tabs defaultActiveKey="1" tabBarStyle={{ textAlign: 'center' }}>
                <TabPane tab="Details" key="1">
                  <CommunityDetails
                    addPostComponentHandler={addPostComponentHandler}
                    community={community}
                    authState={authStore.authState}
                  />
                </TabPane>
                <TabPane tab="Rules" key="2">
                  <RulesContainer rules={rules ? rules : []} />
                </TabPane>
              </Tabs>
              {rules ? '' : ''}
            </aside>{' '}
            <section className={styles.mainSection}>
              <Select
                style={{ marginBottom: '1rem' }}
                defaultValue="new"
                onChange={sortPostsHandler}
              >
                <Option value="new">New</Option>
                <Option value="top">Top</Option>
                <Option value="comment">Comments</Option>
              </Select>
              {posts ? (
                <PostsContainer
                  posts={posts}
                  removePostComponentHandler={removePostComponentHandler}
                  authState={authStore.authState}
                />
              ) : (
                ''
              )}
            </section>
          </div>
        </Suspense>
      ) : (
        ''
      )}
    </>
  );
};
export default withRouter(CommunityPage);
