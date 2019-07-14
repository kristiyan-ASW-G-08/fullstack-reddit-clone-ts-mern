import React, { FC, useState, useEffect, lazy, Suspense } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import PopulatedPost from '@rddt/common/types/PopulatedPost';
import axios from 'axios';
import Loader from 'components/Loader';
const Post = lazy(() => import('../Post/Post'));
interface MatchProps {
  postId: string;
}
const PostPage: FC<RouteComponentProps<MatchProps>> = ({ match }) => {
  const { postId } = match.params;
  const [post, setPost] = useState<PopulatedPost>();
  useEffect(() => {
    axios
      .get(`http://localhost:8080/posts/${postId}`)
      .then(response => {
        const { post } = response.data.data;
        setPost(post);
      })
      .catch(err => console.log(err));
  }, [postId]);
  const deletePostHandler = async () => {};
  return (
    <>
      {post ? (
        <Suspense fallback={<Loader />}>
          <Post post={post} deletePostHandler={deletePostHandler} />
        </Suspense>
      ) : (
        ''
      )}
    </>
  );
};

export default PostPage;
