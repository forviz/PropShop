import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'antd';
import styled from 'styled-components';

import { step0Data, step1Data, step2Data, step3Data } from './mock-data';
import { saveStep } from '../../actions/sell-actions';

const Fixed = styled.div`
  position: fixed;
  padding: 5px;
  box-shadow: 1px 3px 3px rgba(0, 0, 0, 0.4);
  top:100px;
  left:0;
  width: 120px;
`;

const actions = {
  mockupStep0: () => {
    return saveStep('step0', step0Data);
  },
  mockupStep1: () => {
    return saveStep('step1', step1Data);
  },
  mockupStep2: () => {
    return saveStep('step2', step2Data);
  },
  mockupStep3: () => {
    return saveStep('step3', step3Data);
  },
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actions, dispatch);
};

export default connect(undefined, mapDispatchToProps)(
class DevTool extends Component {
  render() {

    const { mockupStep0, mockupStep1, mockupStep2, mockupStep3 } = this.props;
    return (
      <Fixed>
        <p>กรอกข้อมูล</p>
        <div><Button onClick={mockupStep0}>Step 0</Button></div>
        <div><Button onClick={mockupStep1}>Step 1</Button></div>
        <div><Button onClick={mockupStep2}>Step 2</Button></div>
        <div><Button onClick={mockupStep3}>Step 3</Button></div>
      </Fixed>
    );
  }
});
