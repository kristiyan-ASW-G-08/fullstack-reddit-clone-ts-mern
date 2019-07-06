import React, { FC, useEffect } from 'react';
import PopulatedPost from '@rddt/common/types/PopulatedPost';
import { Empty } from 'antd';
import Post from '../Post/Post';
interface PostsContainerProps {
  posts: PopulatedPost[];
}
const PostsContainer: FC<PostsContainerProps> = ({ posts }) => {
  console.log(posts);
  return (
    <div>
      {posts.length === 0 ? (
        <Empty description={<span>No Posts yet</span>} />
      ) : (
        posts.map(post => <Post key={post._id} post={post} />)
      )}
    </div>
  );
};
export default PostsContainer;
