import React, { Component } from 'react';
import * as firebase from '../../api/firebase';
import FontAwesome from 'react-fontawesome';

class SocialLogin extends Component {

  handleFacebookLogin = async () => {
    const error = await firebase.signInWithFacebook();
    this.props.error(error);
  }

  handleGoogleLogin = async () => {
    const error = await firebase.signInWithGoogle();
    this.props.error(error);
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

export default SocialLogin;