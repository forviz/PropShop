import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'antd';
import styled from 'styled-components';

import { step0Data, step1Data, step2Data, step3Data } from './mock-data';
import { saveStep, nextStep, doCreateRealEstate } from '../../actions/sell-actions';

const Fixed = styled.div`
  position: fixed;
  top:100px;
  left:0;
`;

const DevToolContainer = styled.div`
  padding: 15px;
  box-shadow: 1px 3px 3px rgba(0, 0, 0, 0.4);
  background: white;
`;

const mapStateToProps = (state) => {
  return {
    sell: state.sell,
  };
}

const actions = {
  mockupStep0: () => {
    return (dispatch) => {
      dispatch(saveStep('step0', step0Data));
      dispatch(nextStep());
    };
  },
  mockupStep1: () => {
    return (dispatch) => {
      dispatch(saveStep('step1', step0Data));
      dispatch(nextStep());
    };
  },
  mockupStep2: () => {
    return (dispatch) => {
      dispatch(saveStep('step2', step0Data));
      dispatch(nextStep());
    };
  },
  mockupStep3: () => {
    return saveStep('step3', step3Data);
  },
  mockupAllStep: () => {
    return (dispatch) => {
      dispatch(saveStep('step0', step0Data));
      dispatch(saveStep('step1', step1Data));
      dispatch(saveStep('step2', step2Data));
      dispatch(saveStep('step3', step3Data));
      dispatch(nextStep());
      dispatch(nextStep());
      dispatch(nextStep());
    };
  },
  submit: () => {
    return (dispatch, getState) => {
      const sell = _.get(getState(), 'sell');
      dispatch(doCreateRealEstate(sell, {}));
    };
  }
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(
class DevTool extends Component {
  render() {

    const { mockupStep0, mockupStep1, mockupStep2, mockupStep3, mockupAllStep, submit } = this.props;
    return (
      <Fixed>
        <DevToolContainer>
          <p>กรอกข้อมูล</p>
          <div><Button onClick={mockupStep0}>Step 0</Button></div>
          <div><Button onClick={mockupStep1}>Step 1</Button></div>
          <div><Button onClick={mockupStep2}>Step 2</Button></div>
          <div><Button onClick={mockupStep3}>Step 3</Button></div>
          <div><Button onClick={mockupAllStep}>All Step</Button></div>
          <div><Button onClick={submit}>Submit</Button></div>
        </DevToolContainer>
      </Fixed>
    );
  }
});
