import React, { FC, CSSProperties, useEffect } from 'react';
import Community from '@rddt/common/types/Community';
import { RouteComponentProps } from 'react-router-dom';
import { Tabs } from 'antd';
const { TabPane } = Tabs;
interface MatchParams {
  communityId: string;
}
const ModTools: FC<RouteComponentProps<MatchParams>> = ({ match }) => {
  const { communityId } = match.params;
  console.log(communityId);
  return (
    <>
      {' '}
      <Tabs defaultActiveKey="1" tabPosition={'left'} style={{ height: 220 }}>
        <TabPane tab={`1`} key={'1'}>
          Content of tab 1
        </TabPane>
        <TabPane tab={`2`} key={'2'}>
          Content of tab 1
        </TabPane>
        <TabPane tab={`3`} key={'3'}>
          Content of tab 1
        </TabPane>
        <TabPane tab={`4`} key={'4'}>
          Content of tab 1
        </TabPane>
      </Tabs>
    </>
  );
};
export default ModTools;
