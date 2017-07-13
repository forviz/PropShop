import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Spin } from 'antd';

import SpecialFeature from '../../containers/SpecialFeature';

import * as ConfigActions from '../../actions/config-actions';
import * as SellActions from '../../actions/sell-actions';

class Step1 extends Component {

  componentDidMount() {
    const { fetchConfigs } = this.props.actions;
    fetchConfigs();
  }

  handleSpecialFeature = (data) => {
    const { saveStep } = this.props.actions;
    saveStep('step1', data);
  }

  render() {

    const { configRealestate, data } = this.props;

    return (
      <div id="Step1">
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-md-offset-2">
              <h1>คุณสมบัติพิเศษ</h1>
              <div className="form">
                {configRealestate.loading === true ? (
                  <Spin />
                ) : (
                  <SpecialFeature items={configRealestate.data.specialFeature} defaultValue={data} onChange={this.handleSpecialFeature}  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    configRealestate: state.config,
    data: state.sell.step1,
  };
}

const actions = {
  fetchConfigs: ConfigActions.fetchConfigs,
  saveStep: SellActions.saveStep,
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Step1);
