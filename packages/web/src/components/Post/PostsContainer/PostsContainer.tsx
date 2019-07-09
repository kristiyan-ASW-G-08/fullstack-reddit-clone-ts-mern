import React, { FC, useEffect } from 'react';
import PopulatedPost from '@rddt/common/types/PopulatedPost';
import AuthState from 'types/AuthState';
import { Empty } from 'antd';
import Post from '../Post/Post';
import axios from 'axios';
interface PostsContainerProps {
  posts: PopulatedPost[];
  authState: AuthState;
  removePostComponentHandler: (postId: string) => void;
}
const PostsContainer: FC<PostsContainerProps> = ({
  posts,
  authState,
  removePostComponentHandler,
}) => {
  const deletePostHandler = async (postId: string) => {
    try {
      const request = await axios.delete(
        `http://localhost:8080/posts/${postId}`,
        {
          headers: { Authorization: 'bearer ' + authState.token },
        },
      );
      removePostComponentHandler(postId);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      {posts.length === 0 ? (
        <Empty description={<span>No Posts yet</span>} />
      ) : (
        posts.map(post => (
          <Post
            key={post._id}
            post={post}
            deletePostHandler={deletePostHandler}
          />
        ))
      )}
    </div>
  );
};
export default PostsContainer;
