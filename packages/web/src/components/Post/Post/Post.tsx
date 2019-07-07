import React, { FC } from 'react';
import PopulatedPost from '@rddt/common/types/PopulatedPost';
import { Card, Icon, Avatar, Typography, Dropdown, Menu } from 'antd';
import AuthState from 'types/AuthState';

const { Meta } = Card;
const { Text } = Typography;
interface PostProps {
  post: PopulatedPost;
  deletePostHandler: (postId: string) => Promise<void>;
  authState: AuthState;
}
const shareMenu = (
  <Menu>
    <Menu.Item>Twitter</Menu.Item>
    <Menu.Item>Copy Link</Menu.Item>
  </Menu>
);
const ShareDropdown = () => (
  <Dropdown overlay={shareMenu}>
    <Icon type="share-alt" /> Share
  </Dropdown>
);
const Post: FC<PostProps> = ({ post, deletePostHandler, authState }) => {
  const { isAuth, token, user } = authState;
  console.log(post);
  const actions = [
    <Icon type="caret-up" />,
    <span>{post.upvotes - post.downvotes}</span>,
    <Icon type="caret-down" />,
  ];
  if (isAuth && user.userId === post.user._id) {
    const DeleteButton = () => (
      <Icon onClick={() => deletePostHandler(post._id)} type="delete" />
    );
    actions.push(<DeleteButton />);
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
