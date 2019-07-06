import React, { FC, CSSProperties, useContext, useState } from 'react';
import Community from '@rddt/common/types/Community';
import PopulatedPost from '@rddt/common/types/PopulatedPost';
import Modal from 'components/Modal/Modal';
import PostForm from 'components/Post/PostForm/PostForm';
import { Card, Typography, Avatar, Button, Icon } from 'antd';
import RootStoreContext from 'stores/RootStore/RootStore';
import PostFormValues from 'types/PostFormValues';
import AuthState from 'types/AuthState';
import { observer } from 'mobx-react-lite';
import axios from 'axios';
import { Link } from 'react-router-dom';
import openNotification from 'utilities/openNotification';
const { Title, Text } = Typography;
interface CommunityDetailsProps {
  community: Community;
  authState: AuthState;
  addPostComponentHandler: (post: PopulatedPost) => void;
  removePostComponentHandler: (postId: string) => void;
}
const CommunityDetails: FC<CommunityDetailsProps> = observer(
  ({
    community,
    authState,
    removePostComponentHandler,
    addPostComponentHandler,
  }) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [formType, setFormType] = useState<'Add' | 'Edit'>('Add');
    const [editPost, setEditPost] = useState<PopulatedPost>();
    const { authStore, modalStore } = useContext(RootStoreContext);
    const { userId } = authStore.authState.user;
    const { name, description, subscribers, theme, _id } = community;
    console.log(userId, community.user);
    const buttonStyle: CSSProperties = {
      fontWeight: 'bold',
      background: theme.colors.base,
      color: '#ffffff',
    };
    const { token, isAuth } = authState;
    const cancelHandler = () => setVisible(false);
    const addImagePostHandler = async (formData: any) => {
      try {
        console.log(formData, 'Axios');
        const request = await axios.post(
          `http://localhost:8080/communities/${community._id}/posts`,
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
        addPostComponentHandler(post);
      } catch (err) {
        console.log(err);
      }
    };
    const addPostHandler = async (values: PostFormValues) => {
      try {
        const request = await axios.post(
          `http://localhost:8080/communities/${community._id}/posts`,
          values,
          {
            headers: { Authorization: 'bearer ' + token },
          },
        );

        const { post } = request.data.data;
        console.log(post);
        addPostComponentHandler(post);
      } catch (err) {
        console.log(err);
      }
    };
    const setEditHandler = async (post: PopulatedPost) => {
      setEditPost(post);
      setFormType('Edit');
      setVisible(true);
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
        addPostComponentHandler(post);
      } catch (err) {
        console.log(err);
      }
    };
    const deletePostHandler = async (postId: string) => {
      try {
        const request = await axios.delete(
          `http://localhost:8080/posts/${postId}`,
          {
            headers: { Authorization: 'bearer ' + token },
          },
        );
        removePostComponentHandler(postId);
      } catch (err) {
        console.log(err);
      }
    };
    return (
      <>
        <Modal
          title={`${formType} Rule`}
          visible={visible}
          cancelHandler={cancelHandler}
        >
          <PostForm
            type={formType}
            cancelHandler={cancelHandler}
            addPostHandler={addPostHandler}
            editPostHandler={editPostHandler}
            editPost={editPost}
            addImagePostHandler={addImagePostHandler}
          />
        </Modal>
        <Card
          title={
            <>
              Community Details{'   '}
              {userId === community.user ? (
                <Link
                  style={{ color: '#ffffff', marginLeft: '0.3rem' }}
                  to={`/communities/${_id}/mod`}
                >
                  <Icon
                    type="setting"
                    theme="filled"
                    style={{ padding: '0.2rem' }}
                  />
                  Mod Tools
                </Link>
              ) : (
                ''
              )}
            </>
          }
          headStyle={{
            background: `${theme.colors.base}`,
            color: '#ffffff',
            padding: '0',
          }}
          style={{ width: '100%', textAlign: 'center' }}
        >
          <div />
          <Avatar
            size="large"
            src={`http://localhost:8080/images/${theme.icon}`}
            alt={`${name} icon`}
          />
          <Title level={3}>{name}</Title>
          <Text>{`${subscribers} members`}</Text>
          <br />
          <Text>{`${description}`}</Text>
          <div style={{ marginTop: '1rem' }}>
            <Button
              type="primary"
              style={{ marginBottom: '0.5rem', ...buttonStyle }}
              block
            >
              JOIN
            </Button>
            <Button
              type="primary"
              style={{ ...buttonStyle }}
              onClick={() => {
                if (isAuth) {
                  setVisible(true);
                  setFormType('Add');
                } else {
                  openNotification('info', 'Login To Post');
                  modalStore.setModalState('login');
                }
              }}
              block
            >
              CREATE POST
            </Button>
          </div>
        </Card>
      </>
    );
  },
);
export default CommunityDetails;
