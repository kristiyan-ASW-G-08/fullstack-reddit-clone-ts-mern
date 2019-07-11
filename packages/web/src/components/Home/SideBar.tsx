import React, { FC, CSSProperties } from 'react';
import { Card, Typography, Avatar, Button, Icon } from 'antd';
import { Link } from 'react-router-dom';
const { Title, Text } = Typography;
interface SideBarProps {
  openCommunityFormHandler: () => void;
}
const SideBar: FC<SideBarProps> = ({ openCommunityFormHandler }) => {
  const buttonStyle: CSSProperties = {
    fontWeight: 'bold',
    background: '#1890ff',
    color: '#ffffff',
  };
  return (
    <Card
      title={'Home'}
      headStyle={{
        background: `#1890ff`,
        color: '#ffffff',
        padding: '0',
      }}
      style={{ width: '100%', textAlign: 'center' }}
    >
      <div style={{ marginTop: '1rem' }}>
        <Button
          type="primary"
          style={{ marginBottom: '0.5rem', ...buttonStyle }}
          block
        >
          EXPLORE COMMUNITIES
        </Button>
        <Button
          onClick={openCommunityFormHandler}
          type="primary"
          style={{ ...buttonStyle }}
          block
        >
          OR CREATE YOUR OWN
        </Button>
      </div>
    </Card>
  );
};
export default SideBar;
