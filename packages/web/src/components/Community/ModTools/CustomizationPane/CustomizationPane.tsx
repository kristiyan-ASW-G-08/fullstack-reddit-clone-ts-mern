import React, { FC, useEffect, useState, Suspense, lazy } from 'react';
import Community from '@rddt/common/types/Community';
import axios from 'axios';
import Loader from 'components/Loader';
const ColorsForm = lazy(() => import('./ColorsForm'));
const IconForm = lazy(() => import('./IconForm'));
interface CustomizationPaneProps {
  communityId: string;
}
const CustomizationPane: FC<CustomizationPaneProps> = ({ communityId }) => {
  const [community, setCommunity] = useState<Community>();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/communities/${communityId}`)
      .then(response => {
        const { community } = response.data.data;
        setCommunity(community);
      })
      .catch(err => {
        console.log(err);
      });
  }, [communityId]);
  return (
    <>
      {community ? (
        <Suspense fallback={<Loader />}>
          <ColorsForm community={community} />
          <IconForm community={community} />
        </Suspense>
      ) : (
        ''
      )}
    </>
  );
};
export default CustomizationPane;
