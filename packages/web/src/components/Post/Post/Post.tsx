import React, { FC, useState, useEffect, useContext } from 'react';
import PopulatedPost from '@rddt/common/types/PopulatedPost';
import SharePopover from './SharePopover';
import { Card, Icon, Avatar, Typography, Dropdown, Menu, Tooltip } from 'antd';
import AuthState from 'types/AuthState';
import { observer } from 'mobx-react-lite';
import axios from 'axios';
import RootStoreContext from 'stores/RootStore/RootStore';
import { Link } from 'react-router-dom';
const { Meta } = Card;
const { Text } = Typography;
interface PostProps {
  post: PopulatedPost;
  deletePostHandler: (postId: string) => Promise<void>;
}
const Post: FC<PostProps> = observer(({ post, deletePostHandler }) => {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isUpvoted, setIsUpvoted] = useState<boolean>(false);
  const [isDownvoted, setIsDownvoted] = useState<boolean>(false);
  const { authStore } = useContext(RootStoreContext);
  const { authState } = authStore;
  const { isAuth, token, user } = authState;
  useEffect(() => {
    const isSavedCheck = user.savedPosts.includes(post._id);
    const isUpvotedCheck = user.upvotedPosts.includes(post._id);
    const isDownvotedCheck = user.downvotedPosts.includes(post._id);
    setIsUpvoted(isUpvotedCheck);
    setIsDownvoted(isDownvotedCheck);
    setIsSaved(isSavedCheck);
  }, [user.savedPosts, post._id]);
  const savePostHandler = async () => {
    try {
      const request = await axios.patch(
        `http://localhost:8080/users/posts/${post._id}/save`,
        {},
        {
          headers: { Authorization: 'bearer ' + token },
        },
      );
      const { savedPosts } = request.data.data;
      const editedUser = { ...user };
      editedUser.savedPosts = savedPosts;
      authStore.setAuthState({
        expiryDate: authState.expiryDate,
        isAuth,
        token,
        user: editedUser,
      });
      const isSavedCheck = savedPosts.includes(post._id);
      setIsSaved(isSavedCheck);
    } catch (err) {
      console.log(err);
    }
  };
  const voteHandler = async (type: string) => {
    try {
      const request = await axios.patch(
        `http://localhost:8080/users/posts/${post._id}/vote?type=${type}`,
        {},
        {
          headers: { Authorization: 'bearer ' + token },
        },
      );
      const { upvotedPosts, downvotedPosts } = request.data.data;
      const editedUser = { ...user };
      editedUser.upvotedPosts = upvotedPosts;
      editedUser.downvotedPosts = downvotedPosts;
      authStore.setAuthState({
        expiryDate: authState.expiryDate,
        isAuth,
        token,
        user: editedUser,
      });
      const isUpvotedCheck = upvotedPosts.includes(post._id);
      const isDownvotedCheck = downvotedPosts.includes(post._id);
      setIsUpvoted(isUpvotedCheck);
      setIsDownvoted(isDownvotedCheck);
      console.log(request);
    } catch (err) {
      console.log(err);
    }
  };
  let actions = [
    <span>{post.upvotes - post.downvotes}</span>,
    <SharePopover title={post.title} postId={post._id} />,
  ];
  if (isAuth && user.userId === post.user._id) {
    const UpvoteButton = () => (
      <Icon
        type="caret-up"
        onClick={() => voteHandler('upvote')}
        style={{ color: `${isUpvoted ? '#1890ff' : ''}` }}
      />
    );
    const DownvoteButton = () => (
      <Icon
        type="caret-down"
        onClick={() => voteHandler('downvote')}
        style={{ color: `${isDownvoted ? '#faad14' : ''}` }}
      />
    );
    const DeleteButton = () => (
      <Icon onClick={() => deletePostHandler(post._id)} type="delete" />
    );
    const SaveButton = () => (
      <Tooltip title={isSaved ? 'Saved' : 'Not Saved'}>
        <Icon
          type="save"
          onClick={savePostHandler}
          style={{ color: `${isSaved ? '#1890ff' : ''}` }}
        />
      </Tooltip>
    );
    const EditButton = () => (
      <Link
        to={{
          pathname: `/communities/${post.community._id}/posts`,
          state: {
            post,
          },
        }}
      >
        <Icon type="edit" />
      </Link>
    );
    actions = [
      <UpvoteButton />,
      <span>{post.upvotes - post.downvotes}</span>,
      <DownvoteButton />,
      <SharePopover title={post.title} postId={post._id} />,
      <DeleteButton />,
      <EditButton />,
      <SaveButton />,
    ];
  }
  return (
    <Card
      style={{ width: '100%', marginBottom: '1rem' }}
      cover={
        post.type === 'image' ? (
          <img alt="" src={`http://localhost:8080/${post.image}`} />
        ) : (
          ''
        )
      }
      actions={actions}
    >
      <Meta
        avatar={
          <Avatar
            src={`http://localhost:8080/images/${post.community.theme.icon}`}
          />
        }
        title={`${post.title}`}
        description={`r/${post.community.name} • Posted by u/${
          post.user.username
        }`}
      />
      {post.text ? (
        <Text style={{ marginTop: '1rem', display: 'block' }}>{post.text}</Text>
      ) : (
        ''
      )}
      {post.linkUrl ? (
        <a
          style={{ marginTop: '1rem', display: 'block' }}
          href={post.linkUrl}
          rel="noreferrer noopener"
          target="_blank"
        >
          {post.linkUrl}
        </a>
      ) : (
        ''
      )}
    </Card>
  );
});
export default Post;
