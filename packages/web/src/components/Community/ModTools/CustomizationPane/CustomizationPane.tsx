import React, { FC, useEffect, useState, Suspense, lazy } from 'react';
import ColorsForm from './ColorsForm';
import Community from '@rddt/common/types/Community';
import axios from 'axios';
import Loader from 'components/Loader';
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
        </Suspense>
      ) : (
        ''
      )}
    </>
  );
};
export default CustomizationPane;
