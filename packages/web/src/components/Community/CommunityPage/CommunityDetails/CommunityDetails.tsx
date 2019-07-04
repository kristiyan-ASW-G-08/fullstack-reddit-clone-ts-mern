import React, { FC, CSSProperties, useContext } from 'react';
import Community from '@rddt/common/types/Community';
import { Card, Typography, Avatar, Button } from 'antd';
import RootStoreContext from 'stores/RootStore/RootStore';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
const { Title, Text } = Typography;
interface CommunityDetailsProps {
  community: Community;
}
const CommunityDetails: FC<CommunityDetailsProps> = observer(
  ({ community }) => {
    const { userId } = useContext(RootStoreContext).authStore.authState.user;
    const { name, description, subscribers, theme, _id } = community;
    console.log(userId, community.user);
    const buttonStyle: CSSProperties = {
      fontWeight: 'bold',
      background: theme.colors.base,
      color: '#ffffff',
    };
    return (
      <Card
        title={`Community Details ${
          userId === community.user ? (
            <Link to={`/communities/${_id}/mod`}>Mod Tools</Link>
          ) : (
            ''
          )
        }`}
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
          <Button type="primary" style={{ ...buttonStyle }} block>
            CREATE POST
          </Button>
        </div>
      </Card>
    );
  },
);
export default CommunityDetails;
