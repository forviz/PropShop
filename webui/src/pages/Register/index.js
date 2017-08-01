import React, { Component } from 'react';
import { Input, Alert, Spin, notification } from 'antd';

import * as firebase from '../../api/firebase';
import { sendEmailVerified } from '../../api/email';
import * as helpers from '../../helpers';

// import BannerRealEstate from '../../containers/BannerRealEstate';
// import SocialLogin from '../../containers/SocialLogin';
import MemberInfo from '../../containers/MemberInfo';

class Register extends Component {

  state = {
    submitting: false,
    registerSuccess: false,
    errorMessage: '',
    username: {
      value: '',
      errorMessage: '',
    },
    email: {
      value: '',
      errorMessage: '',
    },
    password1: {
      value: '',
      errorMessage: '',
    },
    password2: {
      value: '',
      errorMessage: '',
    },
  }

  componentDidMount() {
    const { history } = this.props;
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

  handleInputUsername = (e) => {
    const value = e.target.value;
    this.setState(prevState => ({
      username: {
        ...prevState.username,
        value,
      },
    }));
  }

  handleInputEmail = (e) => {
    const value = e.target.value;
    this.setState(prevState => ({
      email: {
        ...prevState.email,
        value,
      },
    }));
  }

  handleInputPassword1 = (e) => {
    const value = e.target.value;
    this.setState(prevState => ({
      password1: {
        ...prevState.password1,
        value,
      },
    }));
  }

  handleInputPassword2 = (e) => {
    const value = e.target.value;
    this.setState(prevState => ({
      password2: {
        ...prevState.password2,
        value,
      },
    }));
  }

  checkUsername = (username) => {
    const errorMessage = username === '' ? 'กรุณากรอกชื่อสมาชิก' : '';
    this.setState(prevState => ({
      username: {
        ...prevState.username,
        errorMessage,
      },
    }));
    return errorMessage;
  }

  checkEmail = (email) => {
    const errorMessage = helpers.errorMessageInputEmail(email);
    this.setState(prevState => ({
      email: {
        ...prevState.email,
        errorMessage,
      },
    }));
    return errorMessage;
  }

  checkPassword = (password) => {
    const errorMessage = helpers.errorMessageInputPassword(password);
    this.setState(prevState => ({
      password1: {
        ...prevState.password1,
        errorMessage,
      },
    }));
    return errorMessage;
  }

  checkConfirmPassword = (password1, password2) => {
    const errorMessage = helpers.errorMessageInputConfirmPassword(password1, password2);
    this.setState(prevState => ({
      password2: {
        ...prevState.password2,
        errorMessage,
      },
    }));
    return errorMessage;
  }

  submit = async () => {
    const { submitting } = this.state;

    if (submitting === true) {
      return;
    } else {
      this.setState({
        submitting: true,
      });
    }

    const _self = this;

    const username = this.state.username.value;
    const email = this.state.email.value;
    const password1 = this.state.password1.value;
    const password2 = this.state.password2.value;

    const errorUsername = this.checkUsername(username);
    const errorEmail = this.checkEmail(email);
    this.checkPassword(password1);
    const errorPassword = this.checkConfirmPassword(password1, password2);

    if (errorUsername === '' && errorEmail === '' && errorPassword === '') {
      await firebase.createUser(username, email, password1).then(function(errorMessage) {
        if (errorMessage) {
          _self.setState({
            submitting: false,
            errorMessage,
          });
        } else {
          _self.setState({
            submitting: false,
            registerSuccess: true,
          });
        }
      });

      sendEmailVerified(username, email);
    } else {
      this.setState({
        submitting: false,
      });
    }
  }

  handleSocialError = (error) => {
    if (error.type === 'auth/account-exists-with-different-credential') {
      this.setState({
        errorMessage: error.message,
        email: {
          ...this.state.email,
          value: error.email,
        },
      });
    }
  }

  render() {
    const { submitting } = this.state;

    const usernameErrorMessage = this.state.username.errorMessage ? <span className="text-red">({this.state.username.errorMessage})</span> : '';
    const emailErrorMessage = this.state.email.errorMessage ? <span className="text-red">({this.state.email.errorMessage})</span> : '';
    const password1ErrorMessage = this.state.password1.errorMessage ? <span className="text-red">({this.state.password1.errorMessage})</span> : '';
    const password2ErrorMessage = this.state.password2.errorMessage ? <span className="text-red">({this.state.password2.errorMessage})</span> : '';

    return (
      <div id="Register">
        <div className="row">
          <div className="hidden-xs hidden-sm col-md-6 layout-left">
            <MemberInfo />
          </div>
          <div className="col-md-6 col-md-offset-6 layout-right">
            <Spin tip="Loading..." spinning={submitting}>
              <div className="form">
                <div className="row">
                  <div className="col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
                    <h1>สมัครสมาชิก</h1>
                    {this.state.errorMessage !== '' &&
                      <div className="form-group">
                        <Alert message={this.state.errorMessage} type="error" />
                      </div>
                    }
                    {this.state.registerSuccess === true ? (
                      <div className="form-group">
                        <Alert
                          message="สมัครสมาชิกสำเร็จ"
                          description="กรุณาตรวจสอบอีเมลเพื่อยืนยันตัวตน"
                          type="success"
                          showIcon
                        />
                      </div>
                    ) : (
                      <div>
                        <div className="form-group">
                          <label><span className="text-red">*</span> ชื่อสมาชิก {usernameErrorMessage}</label>
                          <Input onChange={this.handleInputUsername} value={this.state.username.value} />
                        </div>
                        <div className="form-group">
                          <label><span className="text-red">*</span> อีเมล {emailErrorMessage}</label>
                          <Input onChange={this.handleInputEmail} value={this.state.email.value} />
                        </div>
                        <div className="form-group">
                          <label><span className="text-red">*</span> รหัสผ่าน {password1ErrorMessage}</label>
                          <Input type="password" onChange={this.handleInputPassword1} value={this.state.password1.value} />
                        </div>
                        <div className="form-group">
                          <label><span className="text-red">*</span> ยืนยันรหัสผ่าน {password2ErrorMessage}</label>
                          <Input type="password" onChange={this.handleInputPassword2} value={this.state.password2.value} />
                        </div>
                        <div className="form-group action">
                          <button className="btn btn-primary" onClick={this.submit} >สมัครสมาชิก</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/*
              <hr/>
              <div className="social_login">
                <SocialLogin error={this.handleSocialError} />
              </div>
              */}
            </Spin>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
