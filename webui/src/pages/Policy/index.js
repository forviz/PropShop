import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

import { fetchPolicy } from '../../actions/content-actions';

class Policy extends Component {

  static propTypes = {
    // fetching: PropTypes.bool.isRequired,
    // fetchStatus: PropTypes.string.isRequired,
    data: PropTypes.string.isRequired,
    actions: PropTypes.shape().isRequired,
  }

  constructor(props) {
    super(props);
    this.getPolicy();
  }

  getPolicy = () => {
    const { fetchPolicyAction } = this.props.actions;
    fetchPolicyAction();
  }

  render() {
    const { data } = this.props;

    return (
      <div id="Policy" className="page-content">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1>นโยบายความเป็นส่วนตัว</h1>
              <div dangerouslySetInnerHTML={{ __html: data }} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    fetching: state.content.policy.fetching,
    fetchStatus: state.content.policy.fetchStatus,
    data: state.content.policy.data,
  };
};

const actions = {
  fetchPolicyAction: fetchPolicy,
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default compose(firebaseConnect(), connect(mapStateToProps, mapDispatchToProps))(Policy);
