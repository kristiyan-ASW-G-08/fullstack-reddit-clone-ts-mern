import React, { FC } from 'react';
import { Spin } from 'antd';
const Loader: FC = () => (
  <div style={{ textAlign: 'center', padding: '4rem' }}>
    <Spin size="large" />
  </div>
);
export default Loader;
