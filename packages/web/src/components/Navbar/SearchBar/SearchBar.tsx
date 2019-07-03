import React, { useContext, SyntheticEvent, useState, useEffect } from 'react';
import { AutoComplete } from 'antd';
import AutoCompleteCommunity from '../../../types/AutoCompleteCommunity';
import SearchBarOption from './SearchBarOption/SearchBarOption';
import axios from 'axios';
const { Option } = AutoComplete;
const SearchBar: React.FC = () => {
  const [communities, setCommunities] = useState<AutoCompleteCommunity[]>([]);
  const searchHandler = async (e: string) => {
    try {
      if (e && typeof e === 'string') {
        const response = await axios.get(
          `http://localhost:8080/communities/${e}/names`,
        );
        const { data } = response.data;
        if (data.communities) {
          setCommunities(data.communities);
        }
      }
    } catch (err) {
      throw err;
    }
  };
  let autoCompleteChildren: any;
  if (communities) {
    autoCompleteChildren = communities.map(community => (
      <Option disabled key={community.data._id}>
        <SearchBarOption community={community} />
      </Option>
    ));
  }
  const selectHandler = (e: any) => {
    return '';
  };
  return (
    <AutoComplete
      style={{ width: '45vw' }}
      onSelect={selectHandler}
      onSearch={searchHandler}
      placeholder="Search"
    >
      {autoCompleteChildren}
    </AutoComplete>
  );
};

export default SearchBar;
