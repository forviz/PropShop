import React, { Component } from 'react';
import { Input, Alert, Spin, notification } from 'antd';
import { NavLink, Redirect } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';

import * as firebase from '../../api/firebase';
import * as helpers from '../../helpers';

import BannerRealEstate from '../../containers/BannerRealEstate';
import SocialLogin from '../../containers/SocialLogin';

class Login extends Component {

  state = {
    submit: false,
    errorMessage: '',
    email: {
      value: '',
      errorMessage: '',
    },
    password: {
      value: '',
      errorMessage: '',
    },
  }

  componentDidMount() {
    const { history } = this.props;
    const _self = this;
    firebase.core().auth().onAuthStateChanged(function(user) {
      if (user && user.emailVerified === true) {
        history.push({
          pathname: '/',
        });
        // if (user.emailVerified === false) {
        //   _self.openNotificationEailVerified();
        // } else {
        //   history.push({
        //     pathname: '/',
        //   });
        // }
      }
    });
  }

  openNotificationEailVerified = () => {
    notification['warning']({
      message: 'กรุณายืนยันอีเมลของคุณ',
    });
  }

  handleInputEmail = (e) => {
    const value = e.target.value;
    this.setState(prevState => ({
      email: {
        ...prevState.email,
        value: value,
      }
    }));
  }

  handleInputPassword = (e) => {
    const value = e.target.value;
    this.setState(prevState => ({
      password: {
        ...prevState.password,
        value: value,
      }
    }));
  }

  checkEmail = (email) => {
    const errorMessage = helpers.errorMessageInputEmail(email);
    this.setState(prevState => ({
      email: {
        ...prevState.email,
        errorMessage: errorMessage,
      }
    }));
    return errorMessage;
  }

  checkPassword = (password) => {
    const errorMessage = helpers.errorMessageInputPassword(password);
    this.setState(prevState => ({
      password: {
        errorMessage: errorMessage,
      }
    }));
    return errorMessage;
  }

  submit = () => {
    const { submit } = this.state;

    if ( submit === true ) {
      return;
    } else {
      this.setState({
        submit: true,
      });
    }

    const _self = this;

    const email = this.state.email.value;
    const password = this.state.password.value;

    const errorEmail = this.checkEmail(email);
    const errorPassword = this.checkPassword(password);

    if ( errorEmail === '' && errorPassword === '' ) {
      firebase.signIn(email, password).then(function(errorMessage) {
        if ( errorMessage ) {
          _self.setState({
            submit: false,
            errorMessage: errorMessage,
          });
        }
      });
    } else {
      this.setState({
        submit: false,
      });
    }
  }

  handleSocialError = (error) => {
    if (  error.type === 'auth/account-exists-with-different-credential' ) {
      this.setState({
        errorMessage: error.message,
        email: {
          ...this.state.email,
          value: error.email,
        }
      });
    }
  }

  render() {

    const { submit } = this.state;

    const emailErrorMessage = this.state.email.errorMessage ? <span className="text-red">({this.state.email.errorMessage})</span> : '';
    const passwordErrorMessage = this.state.password.errorMessage ? <span className="text-red">({this.state.password.errorMessage})</span> : '';

    const form = 
          <div>
            <div className="form">
              <div className="row">
                <div className="col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
                  <h1>เข้าสู่ระบบ</h1>
                  {this.state.errorMessage !== '' &&
                    <div className="form-group">
                      <Alert message={this.state.errorMessage} type="error" />
                    </div>
                  }
                  <div className="form-group">
                    <label>อีเมล {emailErrorMessage}</label>
                    <Input onChange={this.handleInputEmail} value={this.state.email.value} />
                  </div>
                  <div className="form-group">
                    <label>รหัสผ่าน {passwordErrorMessage}</label>
                    <Input type="password" onChange={this.handleInputPassword} value={this.state.password.value} />
                  </div>
                  <div className="form-group link">
                    <ul>
                      <li><NavLink exact to="/forgotpassword">ลืมรหัสผ่าน?</NavLink></li>
                      <li><NavLink exact to="/register">สมัครสมาชิก</NavLink></li>
                    </ul>
                  </div>
                  <div className="form-group action">
                    <button className="btn btn-primary" onClick={this.submit} >เข้าสู่ระบบ</button>
                  </div>
                </div>
              </div>
            </div>
            <hr/>
            <div className="social_login">
              <SocialLogin error={this.handleSocialError} />
            </div>
          </div>

    return (
      <div id="Login">
      	<div className="row">
          <div className="hidden-xs hidden-sm col-md-6 layout-left">
            <BannerRealEstate />
          </div>
          <div className="col-md-6 col-md-offset-6 layout-right">
            {submit === true ? (
              <Spin tip="Loading...">
                {form}
              </Spin>
            ) : (
              <div>
                {form}
              </div>
            )}
          </div>
      	</div>
      </div>
    );
  }
}

export default Login;