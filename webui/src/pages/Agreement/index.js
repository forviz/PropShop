import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

import { fetchAgreement } from '../../actions/content-actions';

class Agreement extends Component {

  static propTypes = {
    // fetching: PropTypes.bool.isRequired,
    // fetchStatus: PropTypes.string.isRequired,
    data: PropTypes.string.isRequired,
    actions: PropTypes.shape().isRequired,
  }

  constructor(props) {
    super(props);
    this.getAgreement();
  }

  getAgreement = () => {
    const { fetchAgreementAction } = this.props.actions;
    fetchAgreementAction();
  }

  render() {
    const { data } = this.props;

    return (
      <div id="Agreement" className="page-content">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1>ข้อตกลงและเงื่อนไขการใช้บริการเว็บไซต์</h1>
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
    fetching: state.content.agreement.fetching,
    fetchStatus: state.content.agreement.fetchStatus,
    data: state.content.agreement.data,
  };
};

const actions = {
  fetchAgreementAction: fetchAgreement,
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default compose(firebaseConnect(), connect(mapStateToProps, mapDispatchToProps))(Agreement);
