import React, { FC, useContext, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import PostFormValues from 'types/PostFormValues';
import PopulatedPost from '@rddt/common/types/PopulatedPost';
import RootStoreContext from 'stores/RootStore/RootStore';
import PostForm from './PostForm';
interface MatchProps {
  communityId?: string;
  postId?: string;
}
const PostFormPage: FC<RouteComponentProps<MatchProps>> = ({
  match,
  history,
}) => {
  const { token } = useContext(RootStoreContext).authStore.authState;
  const [formType, setFormType] = useState<'Add' | 'Edit'>('Add');
  const [editPost, setEditPost] = useState<PopulatedPost>();
  const addImagePostHandler = async (formData: any) => {
    try {
      console.log(formData, 'Axios');
      const request = await axios.post(
        `http://localhost:8080/communities/${communityId}/posts`,
        formData,
        {
          headers: {
            Authorization: 'bearer ' + token,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      const { post } = request.data.data;
      console.log(post);
    } catch (err) {
      console.log(err);
    }
  };
  const addPostHandler = async (values: PostFormValues) => {
    try {
      const request = await axios.post(
        `http://localhost:8080/communities/${communityId}/posts`,
        values,
        {
          headers: { Authorization: 'bearer ' + token },
        },
      );

      const { post } = request.data.data;
      console.log(post);
    } catch (err) {
      console.log(err);
    }
  };
  const editPostHandler = async (values: PostFormValues) => {
    try {
      if (!editPost) {
        throw '';
      }
      const request = await axios.patch(
        `http://localhost:8080/posts/${editPost._id}`,
        values,
        {
          headers: { Authorization: 'bearer ' + token },
        },
      );
      const { post } = request.data.data;
    } catch (err) {
      console.log(err);
    }
  };
  const cancelHandler = () => {};
  console.log(match, history);
  const { communityId } = match.params;
  console.log(match.params);
  return (
    <div
      style={{
        width: '100vw',
        height: '90vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <PostForm
        cancelHandler={cancelHandler}
        type={formType}
        addPostHandler={addPostHandler}
        editPostHandler={editPostHandler}
        editPost={editPost}
        addImagePostHandler={addImagePostHandler}
      />
    </div>
  );
};
export default PostFormPage;
