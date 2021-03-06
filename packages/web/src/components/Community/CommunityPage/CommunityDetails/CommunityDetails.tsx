import React, {
  FC,
  CSSProperties,
  useContext,
  useState,
  useEffect,
} from 'react';
import Community from '@rddt/common/types/Community';
import PopulatedPost from '@rddt/common/types/PopulatedPost';
import { Card, Typography, Avatar, Button, Icon } from 'antd';
import RootStoreContext from 'stores/RootStore/RootStore';
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
}
const CommunityDetails: FC<CommunityDetailsProps> = observer(
  ({ community, authState, addPostComponentHandler }) => {
    const [hasJoined, setHasJoined] = useState<boolean>(false);
    const { authStore, modalStore } = useContext(RootStoreContext);
    const { userId } = authStore.authState.user;
    const { name, description, subscribers, theme, _id } = community;
    console.log(userId, community.user);
    const buttonStyle: CSSProperties = {
      fontWeight: 'bold',
      background: theme.colors.base,
      color: '#ffffff',
    };
    const { isAuth, token, user } = authState;
    useEffect(() => {
      const hasJoinedCheck = user.communities.includes(community._id);
      setHasJoined(hasJoinedCheck);
    }, [community]);

    const joinHandler = async () => {
      try {
        if (isAuth) {
          const request = await axios.patch(
            `http://localhost:8080/users/communities/${community._id}`,
            {},
            {
              headers: { Authorization: 'bearer ' + token },
            },
          );
          console.log(request);
          const { communities } = request.data.data;
          const editedUser = { ...user };
          editedUser.communities = communities;
          authStore.setAuthState({
            expiryDate: authState.expiryDate,
            isAuth,
            token,
            user: editedUser,
          });
          console.log(communities);
          const hasJoinedCheck = communities.includes(community._id);
          setHasJoined(hasJoinedCheck);
          authStore.setAuthState(authState);
        } else {
          modalStore.setModalState('login');
        }
      } catch (err) {
        console.log(err);
      }
    };
    return (
      <Card
        title={
          <>
            Home{'   '}
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
          src={`http://localhost:8080${theme.icon}`}
          alt={`${name} icon`}
        />
        <Title level={3}>{name}</Title>
        <Text>{`${subscribers} members`}</Text>
        <br />
        <Text>{`${description}`}</Text>
        <div style={{ marginTop: '1rem' }}>
          <Button
            onClick={joinHandler}
            type="primary"
            style={{ marginBottom: '0.5rem', ...buttonStyle }}
            block
          >
            {hasJoined ? 'JOINED' : 'JOIN'}
          </Button>
          <Link to={`/communities/${community._id}/posts`}>
            <Button type="primary" style={{ ...buttonStyle }} block>
              CREATE POST
            </Button>
          </Link>
        </div>
      </Card>
    );
  },
);
export default CommunityDetails;
