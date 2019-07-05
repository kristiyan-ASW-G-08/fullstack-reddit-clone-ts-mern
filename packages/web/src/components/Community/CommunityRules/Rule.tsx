import React, { FC } from 'react';
import RuleType from '@rddt/common/types/Rule';
import { Button, Card, Typography } from 'antd';
const { Text } = Typography;
interface RuleProps {
  rule: RuleType;
  deleteRuleHandler: (ruleId: string) => Promise<void>;
  setEditHandler: (rule: RuleType) => void;
}
const Rule: FC<RuleProps> = ({ rule, deleteRuleHandler, setEditHandler }) => {
  return (
    <Card
      style={{ border: 'none', width: '100%' }}
      actions={[
        <Button type="danger" onClick={() => deleteRuleHandler(rule._id)}>
          Delete
        </Button>,
        <Button type="primary" onClick={() => setEditHandler(rule)}>
          Edit
        </Button>,
      ]}
    >
      <Text strong>Description: {rule.description}</Text>
      <br />
      <Text strong>Applies to: {rule.scope}</Text>
      <br />
      <Text strong>Created at: {new Date(rule.date).toUTCString()}</Text>
    </Card>
  );
};

export default Rule;
