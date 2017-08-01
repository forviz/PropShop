import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Sell from '../../../pages/Sell';
import * as PropertyActions from '../../../actions/property-actions';

class PropertyEdit extends Component {

  static propTypes = {
    id: T.string.isRequired,
    actions: T.shape().isRequired,
    history: T.shape().isRequired,
  }

  constructor(props) {
    super(props);
    const id = props.id;
    this.getProperty(id);
  }

  getProperty = (id) => {
    const { fetchPropertiesById } = this.props.actions;
    fetchPropertiesById(id);
  }

  render() {
    return (
      <div id="PropertyEdit">
        <Sell history={this.props.history} />
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    // user: state.user.data,
    // properties: state.domain.accountProperty.data,
    // fetching: state.domain.accountProperty.fetching,
    // result: state.domain.accountProperty.result,
  };
};

const actions = {
  fetchPropertiesById: PropertyActions.fetchPropertiesById,
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PropertyEdit);
