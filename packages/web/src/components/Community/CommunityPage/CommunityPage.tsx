import React, { FC, useState, useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Community from '@rddt/common/types/Community';
import axios from 'axios';
import CommunityDetauls from './CommunityDetails/CommunityDetails';
import { request } from 'http';
interface MatchParams {
  communityId: string;
}
const CommunityPage: FC<RouteComponentProps<MatchParams>> = ({
  history,
  match,
}) => {
  const [community, setCommunity] = useState<Community>();
  const { communityId } = match.params;
  useEffect(() => {
    axios
      .get(`http://localhost:8080/communities/${communityId}`)
      .then(request => {
        console.log(request.data);
        const { community } = request.data.data;
        setCommunity(community);
      })
      .catch(err => {
        console.log(err);
      });
  }, [communityId]);
  console.log(communityId);
  return <div />;
};
export default withRouter(CommunityPage);
