import React, { FC } from 'react';
import Community from '@rddt/common/types/Community';
import { Card } from 'antd';
interface CommunityDetailsProps {
  community: Community;
}
const CommunityDetails: FC<CommunityDetailsProps> = ({ community }) => {
  return (
    <Card title="Default size card" extra={<a>More</a>} style={{ width: 300 }}>
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </Card>
  );
};
export default CommunityDetails;
