import React, { FC, useState, useEffect, Suspense, lazy } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Community from '@rddt/common/types/Community';
import axios from 'axios';
import Loader from 'components/Loader';
const CommunityDetails = lazy(() =>
  import('./CommunityDetails/CommunityDetails'),
);
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
  return (
    <>
      {community ? (
        <Suspense fallback={<Loader />}>
          <CommunityDetails community={community} />
        </Suspense>
      ) : (
        ''
      )}
    </>
  );
};
export default withRouter(CommunityPage);
