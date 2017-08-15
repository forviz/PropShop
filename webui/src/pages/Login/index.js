import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Alert, Spin } from 'antd';
import { NavLink, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { firebaseConnect, pathToJS } from 'react-redux-firebase';
import queryString from 'query-string';
import _ from 'lodash';

import * as helpers from '../../helpers';

import SocialLogin from '../../containers/SocialLogin';
import MemberInfo from '../../containers/MemberInfo';
import { emailVerifying } from '../../api/email';
import { mapFirebaseErrorMessage } from '../../api/firebase';

class Login extends Component {

  static propTypes = {
    firebase: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    location: PropTypes.shape().isRequired,
    authError: PropTypes.shape(),
    user: PropTypes.shape(),
    userFetchSuccess: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.checkEmailVerifying();
  }

  state = {
    submitting: false,
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

  checkEmailVerifying = async () => {
    const { history } = this.props;
    const params = queryString.parse(history.location.search);
    if (params.verify) {
      await emailVerifying(params.verify);
      window.location = '/';
    }
  }

  handleInputPassword = (e) => {
    const value = e.target.value;
    this.setState(prevState => ({
      password: {
        ...prevState.password,
        value,
      },
    }));
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
    this.setState(() => ({
      password: {
        errorMessage,
      },
    }));
    return errorMessage;
  }

  submit = async () => {
    const { firebase } = this.props;
    const { submitting } = this.state;

    if (submitting === true) {
      return false;
    }

    const email = this.state.email.value;
    const password = this.state.password.value;

    const errorEmail = this.checkEmail(email);
    const errorPassword = this.checkPassword(password);

    if (errorEmail === '' && errorPassword === '') {
      this.setState({
        submitting: true,
      });
      await firebase.login({
        email,
        password,
      });
      this.setState({
        submitting: false,
      });
    }
    return true;
  }

  handleSocialError = (error) => {
    if (_.get(error, 'type') && error.type === 'auth/account-exists-with-different-credential') {
      this.setState({
        errorMessage: error.message,
        email: {
          ...this.state.email,
          value: error.email,
        },
      });
    } else {
      const { history } = this.props;
      const { param } = this.props.location.search;
      if (param) {
        const search = queryString.parse(param);
        if (_.get(search, 'redirectFrom')) {
          history.push({ pathname: `/${search.redirectFrom}` });
        } else {
          history.push({ pathname: '/' });
        }
      }
    }
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

  render() {
    const { submitting } = this.state;
    const { authError, user, userFetchSuccess } = this.props;

    if (!userFetchSuccess) return <div />;

    let from = '/';
    if (this.props.location.search) {
      const params = queryString.parse(this.props.location.search);
      if (_.get(params, 'redirect')) {
        from = params.redirect;
      }
    }

    const emailErrorMessage = this.state.email.errorMessage ? <span className="text-red">({this.state.email.errorMessage})</span> : '';
    const passwordErrorMessage = this.state.password.errorMessage ? <span className="text-red">({this.state.password.errorMessage})</span> : '';

    if (userFetchSuccess === true) {
      if (user.verify) {
        return (
          <Redirect to={from} />
        );
      }
    }

    return (
      <div id="Login">
        <div className="row">
          <div className="hidden-xs hidden-sm col-md-6 layout-left">
            <MemberInfo />
          </div>
          <div className="col-md-6 col-md-offset-6 layout-right">
            <Spin tip="Loading..." spinning={submitting}>
              <div className="form">
                <div className="row">
                  <div className="col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
                    <h1>เข้าสู่ระบบ</h1>
                    {_.get(authError, 'message') &&
                      <div className="form-group">
                        <Alert message={mapFirebaseErrorMessage(authError.message)} type="error" />
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
              <hr />
              <div className="social_login">
                <SocialLogin error={this.handleSocialError} />
              </div>
            </Spin>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authError: pathToJS(state.firebase, 'authError'),
    user: state.user.data,
    userFetchSuccess: state.user.fetchSuccess,
  };
};

const actions = {

};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default compose(firebaseConnect(), connect(mapStateToProps, mapDispatchToProps))(Login);
