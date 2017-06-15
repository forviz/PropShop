import React, { Component } from 'react';
import { Spin } from 'antd';

class Loading extends Component {
  render() {
    return (
      <div style={{position:'relative',height:100}}><Spin /></div>
    );
  }
}

export default Loading;