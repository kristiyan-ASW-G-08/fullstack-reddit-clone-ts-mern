import React, { FC } from 'react';
import PopulatedPost from '@rddt/common/types/PopulatedPost';
import SharePopover from './SharePopover';
import { Card, Icon, Avatar, Typography, Dropdown, Menu } from 'antd';
import AuthState from 'types/AuthState';
import axios from 'axios';
import { Link } from 'react-router-dom';
const { Meta } = Card;
const { Text } = Typography;
interface PostProps {
  post: PopulatedPost;
  deletePostHandler: (postId: string) => Promise<void>;
  authState: AuthState;
}
const Post: FC<PostProps> = ({ post, deletePostHandler, authState }) => {
  const { isAuth, token, user } = authState;
  console.log(post);
  const savePostHandler = async () => {
    console.log(token);
    const request = await axios.patch(
      `http://localhost:8080/users/posts/${post._id}/save`,
      {},
      {
        headers: { Authorization: 'bearer ' + token },
      },
    );
    console.log(request);
    try {
    } catch (err) {
      console.log(err);
    }
  };
  const actions = [
    <Icon type="caret-up" />,
    <span>{post.upvotes - post.downvotes}</span>,
    <Icon type="caret-down" />,
    <SharePopover title={post.title} postId={post._id} />,
  ];
  if (isAuth && user.userId === post.user._id) {
    const DeleteButton = () => (
      <Icon onClick={() => deletePostHandler(post._id)} type="delete" />
    );
    const SaveButton = () => <Icon type="save" onClick={savePostHandler} />;
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
    actions.push(<DeleteButton />, <EditButton />, <SaveButton />);
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
};
export default Post;
