import React from 'react';
import AutoCompleteCommunity from '../../../../types/AutoCompleteCommunity';
import { Avatar } from 'antd';
import { Typography } from 'antd';
const { Text } = Typography;
interface SearchBarOptionProps {
  community: AutoCompleteCommunity;
}
const SearchBarOption: React.FC<SearchBarOptionProps> = ({ community }) => {
  return (
    <div>
      {' '}
      <Avatar
        size="small"
        src={`http://localhost:8080/images/${community.data.theme.icon}`}
        alt={`${community.data.name} icon`}
      />
      <Text style={{ padding: '10px' }}>{community.data.name}</Text>
      <Text style={{ padding: '10px' }}>
        {community.data.subscribers} members
      </Text>
    </div>
  );
};

export default SearchBarOption;
