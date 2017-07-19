import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import FontAwesome from 'react-fontawesome';

class SocialLogin extends Component {

  static propTypes = {
    firebase: PropTypes.shape().isRequired,
  }

  handleFacebookLogin = () => {
    const { firebase } = this.props;
    firebase.login({
      provider: 'facebook',
      type: 'popup',
    });
  }

  handleGoogleLogin = () => {
    const { firebase } = this.props;
    firebase.login({
      provider: 'google',
      type: 'popup',
    });
  }

  render() {
    return (
      <div className="SocialLogin">
        <div className="text">เข้าสู่ระบบด้วย</div>
        <div className="social-media">
          <ul>
            <li className="facebook">
              <a role="button" tabIndex="0" onClick={this.handleFacebookLogin}><FontAwesome name="facebook" /></a>
            </li>
            <li className="google-plus">
              <a role="button" tabIndex="0" onClick={this.handleGoogleLogin}><FontAwesome name="google-plus" /></a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => {
  return {};
};

const actions = {};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default compose(firebaseConnect(), connect(mapStateToProps, mapDispatchToProps))(SocialLogin);
