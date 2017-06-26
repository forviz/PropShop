import React from 'react';
import { Rate } from 'antd';

export default ({ value }) => {
  return (
    <Rate value={value} allowHalf disabled />
  );
};
