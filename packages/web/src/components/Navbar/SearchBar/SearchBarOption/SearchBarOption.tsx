import React from 'react';
import AutoCompleteCommunity from '../../../../types/AutoCompleteCommunity';
import { Avatar } from 'antd';
import { Typography } from 'antd';
import { Link } from 'react-router-dom';
const { Text } = Typography;
interface SearchBarOptionProps {
  community: AutoCompleteCommunity;
}
const SearchBarOption: React.FC<SearchBarOptionProps> = ({ community }) => {
  const { name, subscribers, _id, theme } = community.data;
  return (
    <Link to={`/communities/${_id}`}>
      <Avatar
        size="small"
        src={`http://localhost:8080/images/${theme.icon}`}
        alt={`${name} icon`}
      />
      <Text style={{ padding: '10px' }}>{name}</Text>
      <Text style={{ padding: '10px' }}>{subscribers} members</Text>
    </Link>
  );
};

export default SearchBarOption;
