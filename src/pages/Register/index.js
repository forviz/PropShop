import React, { Component } from 'react';
import { Input, Alert, Spin } from 'antd';
import { NavLink, Redirect } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';

import * as firebase from '../../api/firebase';
import * as helpers from '../../helpers';

import BannerRealEstate from '../../containers/BannerRealEstate';
import SocialLogin from '../../containers/SocialLogin';

class Register extends Component {

  state = {
    submit: false,
    errorMessage: '',
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
    }
  }

  componentDidMount() {
    const { history } = this.props;
    firebase.core().auth().onAuthStateChanged(function(user) {
      if (user) {
        history.push({
          pathname: '/',
        });
      }
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

  handleInputPassword1 = (e) => {
    const value = e.target.value;
    this.setState(prevState => ({
      password1: {
        ...prevState.password1,
        value: value,
      }
    }));
  }

  handleInputPassword2 = (e) => {
    const value = e.target.value;
    this.setState(prevState => ({
      password2: {
        ...prevState.password2,
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
      password1: {
        ...prevState.password1,
        errorMessage: errorMessage,
      }
    }));
    return errorMessage;
  }

  checkConfirmPassword = (password1, password2) => {
    const errorMessage = helpers.errorMessageInputConfirmPassword(password1, password2);
    this.setState(prevState => ({
      password2: {
        ...prevState.password2,
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
    const password1 = this.state.password1.value;
    const password2 = this.state.password2.value;

    const errorEmail = this.checkEmail(email);
    this.checkPassword(password1);
    const errorPassword = this.checkConfirmPassword(password1, password2);

    if ( errorEmail === '' && errorPassword === '' ) {
      firebase.createUser(email, password1).then(function(errorMessage) {
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
    const password1ErrorMessage = this.state.password1.errorMessage ? <span className="text-red">({this.state.password1.errorMessage})</span> : '';
    const password2ErrorMessage = this.state.password2.errorMessage ? <span className="text-red">({this.state.password2.errorMessage})</span> : '';

    const form = 
          <div>
            <div className="form">
              <div className="row">
                <div className="col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
                  <h1>สมัครสมาชิก</h1>
                  {this.state.errorMessage !== '' &&
                    <div className="form-group">
                      <Alert message={this.state.errorMessage} type="error" />
                    </div>
                  }
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
                    <button className="btn btn-primary" onClick={this.submit} >ตกลง</button>
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
      <div id="Register">
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

export default Register;