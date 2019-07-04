import React, { FC, CSSProperties, useEffect } from 'react';
import Community from '@rddt/common/types/Community';
import CommunityDetails from '../CommunityDetails/CommunityDetails';
import { Tabs } from 'antd';
const { TabPane } = Tabs;
interface CommunitySidebarProps {
  community: Community;
}
const CommunitySidebar: FC<CommunitySidebarProps> = ({ community }) => {
  useEffect(() => {});
  return (
    <>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Details" key="1">
          <CommunityDetails community={community} />
        </TabPane>
        <TabPane tab="Tab 2" key="2">
          Content of Tab Pane 2
        </TabPane>
        <TabPane tab="Tab 3" key="3">
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
    </>
  );
};
export default CommunitySidebar;
