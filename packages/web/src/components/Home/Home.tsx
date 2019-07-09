import React, { FC, useState, useEffect, Suspense, useContext } from 'react';
import axios from 'axios';
import PopulatedPosts from '@rddt/common/types/PopulatedPost';
import PostsContainer from 'components/Post/PostsContainer/PostsContainer';
import RootStoreContext from 'stores/RootStore/RootStore';
import { observer } from 'mobx-react-lite';
import styles from './Home.module.scss';
import { Select } from 'antd';
const { Option } = Select;

const Home: FC = observer(() => {
  const [posts, setPosts] = useState<PopulatedPosts[]>([]);
  const { authStore } = useContext(RootStoreContext);
  const { isAuth, token } = authStore.authState;
  useEffect(() => {
    let postsUrl: string = isAuth
      ? `http://localhost:8080/users/posts`
      : 'http://localhost:8080/posts';
    let requestHeaders = {};
    if (isAuth) {
      requestHeaders = {
        headers: { Authorization: 'bearer ' + token },
      };
    }
    console.log(postsUrl, requestHeaders);
    axios
      .get(postsUrl, requestHeaders)
      .then(request => {
        const { posts } = request.data.data;
        setPosts(posts);
      })
      .catch(err => {
        console.log(err);
      });
  }, [isAuth]);
  const removePostComponentHandler = (postId: String) => {
    if (posts) {
      const editedPosts = posts.filter(post => post._id !== postId);
      setPosts([...editedPosts]);
    }
  };
  return (
    <div className={styles.grid}>
      <aside className={styles.sidebar}>some</aside>{' '}
      <section className={styles.mainSection}>
        <Select
          style={{ marginBottom: '1rem' }}
          defaultValue="new"
          onChange={() => {}}
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
  );
});
export default Home;
