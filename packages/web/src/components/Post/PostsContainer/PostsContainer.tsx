import React, { FC, useEffect } from 'react';
import PopulatedPost from '@rddt/common/types/PopulatedPost';
import AuthState from 'types/AuthState';
import { Empty } from 'antd';
import Post from '../Post/Post';
interface PostsContainerProps {
  posts: PopulatedPost[];
  deletePostHandler: (postId: string) => Promise<void>;
  authState: AuthState;
}
const PostsContainer: FC<PostsContainerProps> = ({
  posts,
  deletePostHandler,
  authState,
}) => {
  console.log(posts);
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
            authState={authState}
          />
        ))
      )}
    </div>
  );
};
export default PostsContainer;
