import React, { FC, useEffect } from 'react';
import Rule from '@rddt/common/types/Rule';
import { Collapse } from 'antd';
import { Empty } from 'antd';
const { Panel } = Collapse;
interface RulesContainerProps {
  rules: Rule[];
}
const RulesContainer: FC<RulesContainerProps> = ({ rules }) => {
  return (
    <>
      {rules.length === 0 ? (
        <Empty description={<span>No Rules yet </span>} />
      ) : (
        <Collapse accordion>
          {rules.map(rule => (
            <Panel key={rule._id} header={rule.name}>
              <p>Description: {rule.description}</p>
              <p>Applies to: {rule.scope}</p>
            </Panel>
          ))}
        </Collapse>
      )}
    </>
  );
};
export default RulesContainer;
