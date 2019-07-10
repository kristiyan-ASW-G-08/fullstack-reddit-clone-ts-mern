import React, { FC, useState, useEffect, Suspense, useContext } from 'react';
import axios from 'axios';
import PopulatedPosts from '@rddt/common/types/PopulatedPost';
import PostsContainer from 'components/Post/PostsContainer/PostsContainer';
import RootStoreContext from 'stores/RootStore/RootStore';
import { observer } from 'mobx-react-lite';
import { Select } from 'antd';
const { Option } = Select;
const UserFeedTabPane: FC = observer(() => {
  const [posts, setPosts] = useState<PopulatedPosts[]>([]);
  const { authStore } = useContext(RootStoreContext);
  const { isAuth, token } = authStore.authState;
  let postsUrl: string = `http://localhost:8080/users/posts`;
  useEffect(() => {
    const requestHeaders = {
      headers: { Authorization: 'bearer ' + token },
    };

    console.log(postsUrl, requestHeaders);
    axios
      .get(`${postsUrl}?sort=new`, requestHeaders)
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
  const sortPostsHandler = async (sortType: string) => {
    try {
      console.log(sortType);
      const requestHeaders = {
        headers: { Authorization: 'bearer ' + token },
      };
      const request = await axios.get(
        `${postsUrl}?sort=${sortType}`,
        requestHeaders,
      );
      console.log(request.data.data);
      const { posts } = request.data.data;
      setPosts(posts);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      {posts ? (
        <>
          <Select
            style={{ marginBottom: '1rem' }}
            defaultValue="new"
            onChange={sortPostsHandler}
          >
            <Option value="new">New</Option>
            <Option value="top">Top</Option>
            <Option value="comment">Comments</Option>
          </Select>
          <PostsContainer
            posts={posts}
            removePostComponentHandler={removePostComponentHandler}
            authState={authStore.authState}
            emptyMessage={'Join a community to customize your feed'}
          />
        </>
      ) : (
        ''
      )}
    </>
  );
});
export default UserFeedTabPane;
