import React, { FC, CSSProperties, useEffect, useState } from 'react';
import Community from '@rddt/common/types/Community';
import Rule from '@rddt/common/types/Rule';
import { RouteComponentProps } from 'react-router-dom';
import { Tabs } from 'antd';
import RulesPane from '../CommunityRules/RulesPane';
import axios from 'axios';
const { TabPane } = Tabs;
interface MatchParams {
  communityId: string;
}
const ModTools: FC<RouteComponentProps<MatchParams>> = ({ match }) => {
  const { communityId } = match.params;

  return (
    <>
      {' '}
      <Tabs
        defaultActiveKey="1"
        style={{ height: '90vh' }}
        tabBarStyle={{ textAlign: 'center' }}
      >
        <TabPane tab={`Rules`} key={'1'}>
          <RulesPane communityId={communityId} />
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
