import React, { FC, CSSProperties } from 'react';
import Rule from '@rddt/common/types/Rule';
import { Card, Typography, Avatar, Button } from 'antd';
const { Title, Text } = Typography;
interface CommunityRulesProps {
  rules: Rule[];
}
const CommunityRules: FC<CommunityRulesProps> = ({ rules }) => {
  //   const buttonStyle: CSSProperties = {
  //     fontWeight: 'bold',
  //     background: theme.colors.base,
  //     color: '#ffffff',
  //   };
  return <></>;
};
export default CommunityRules;
