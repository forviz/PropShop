import React, { Component } from 'react';
import { Input, Alert, Spin } from 'antd';
import { NavLink, Redirect } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';

import * as firebase from '../../api/firebase';
import * as helpers from '../../helpers';

import BannerRealEstate from '../../containers/BannerRealEstate';
import SocialLogin from '../../containers/SocialLogin';

class Forgotpassword extends Component {

  state = {
    loading: false,
    submit: false,
    errorMessage: '',
    email: {
      value: '',
      errorMessage: '',
    },
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

  submit = () => {
    const { loading } = this.state;

    if ( loading === true ) {
      return;
    } else {
      this.setState({
        loading: true,
      });
    }

    const _self = this;

    const email = this.state.email.value;

    const errorEmail = this.checkEmail(email);

    if ( errorEmail === '' ) {
      firebase.forgotpassword(email).then(function(errorMessage) {
        if ( errorMessage ) {
          _self.setState({
            loading: false,
            errorMessage: errorMessage,
          });
        } else {
          _self.setState({
            submit: true,
            loading: false,
            errorMessage: '',
          });
        }
      });
    } else {
      this.setState({
        loading: false,
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

    const { loading, submit } = this.state;

    const emailErrorMessage = this.state.email.errorMessage ? <span className="text-red">({this.state.email.errorMessage})</span> : '';

    const form = 
          <div>
            <div className="form">
              <div className="row">
                <div className="col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
                  <h1>ลืมรหัสผ่าน</h1>
                  {this.state.errorMessage !== '' &&
                    <div className="form-group">
                      <Alert message={this.state.errorMessage} type="error" />
                    </div>
                  }
                  {submit === true ? (
                    <div className="form-group">
                      <label>กรุณาตรวจสอบอีเมล {this.state.email.value}</label>
                    </div>
                  ) : (
                    <div>
                      <div className="form-group">
                        <label>อีเมล {emailErrorMessage}</label>
                        <Input onChange={this.handleInputEmail} value={this.state.email.value} />
                      </div>
                      <div className="form-group action">
                        <button className="btn btn-primary" onClick={this.submit} >ลืมรหัสผ่าน</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <hr/>
            <div className="social_login">
              <SocialLogin error={this.handleSocialError} />
            </div>
          </div>

    return (
      <div id="Forgotpassword">
        <div className="row">
          <div className="hidden-xs hidden-sm col-md-6 layout-left">
            <BannerRealEstate />
          </div>
          <div className="col-md-6 col-md-offset-6 layout-right">
            {loading === true ? (
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

export default Forgotpassword;