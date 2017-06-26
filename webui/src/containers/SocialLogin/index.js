import React, { Component } from 'react';
import * as firebase from '../../api/firebase';
import FontAwesome from 'react-fontawesome';

class SocialLogin extends Component {

  handleFacebookLogin = async () => {
    const error = await firebase.signInWithFacebook();
    console.log('handleFacebookLogin', error);
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
            <li className="facebook" onClick={this.handleFacebookLogin} ><FontAwesome name="facebook" /></li>
            <li className="google-plus" onClick={this.handleGoogleLogin} ><FontAwesome name="google-plus" /></li>
          </ul>
        </div>
      </div>
    );
  }
}

export default SocialLogin;