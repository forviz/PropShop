import React, { Component } from 'react';
import { Alert } from 'antd';
import { NavLink, Redirect } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';

import * as firebase from '../../api/firebase';
import * as contentful from '../../api/contentful';
import * as helpers from '../../helpers';

import BannerRealEstate from '../../containers/BannerRealEstate';

class Login extends Component {

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  state = {
    errorMessage: '',
    email: {
      errorMessage: '',
    },
    password: {
      errorMessage: '',
    },
  }

  componentDidMount() {
    const { history } = this.props;
    const _self = this;
    firebase.core().auth().onAuthStateChanged(function(user) {
      if (user) {
        history.push({
          pathname: '/',
        });
      }
    });
  }

  checkEmail = (email) => {
    const errorMessage = helpers.errorMessageInputEmail(email);
    this.setState(prevState => ({
      email: {
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

  submit() {
    const { history } = this.props;

    const _self = this;

    const email = this.inputEmail.value;
    const password = this.inputPassword.value;

    const errorEmail = this.checkEmail(email);
    const errorPassword = this.checkPassword(password);

    if ( errorEmail === '' && errorPassword === '' ) {
      firebase.signIn(email, password).then(function(user) {
        if ( user.message ) {
          const errorMessage = user.code === 'auth/user-not-found' ? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' : user.message;
          _self.setState(prevState => ({
            errorMessage: errorMessage
          }));
        } else {
          history.push({
            pathname: '/',
          });
          // const uid = user.uid;
          // const newUser = {
          //   uid: uid,
          //   name: '',
          //   lastname: '',
          // }
          // contentful.createUser(newUser).then((newUserData) => {
          //   history.push({
          //     pathname: '/',
          //   });
          // });
        }
      }).catch(function(error) {

      });
    }
  }

  render() {

    const emailErrorMessage = this.state.email.errorMessage ? <span className="text-red">({this.state.email.errorMessage})</span> : '';
    const passwordErrorMessage = this.state.password.errorMessage ? <span className="text-red">({this.state.password.errorMessage})</span> : '';

    return (
      <div id="Login">
      	<div className="row">
      		<div className="col-md-6 layout-left">
      			<BannerRealEstate />
      		</div>
      		<div className="col-md-6 col-md-offset-6 layout-right">
      			<div className="form">
      				<div className="row">
      					<div className="col-md-6 col-md-offset-3">
      						<h1>เข้าสู่ระบบ</h1>
                  {this.state.errorMessage !== '' &&
                    <Alert message={this.state.errorMessage} type="error" />
                  }
								  <div className="form-group">
								    <label>อีเมล {emailErrorMessage}</label>
								    <input type="email" className="form-control" ref={(input) => { this.inputEmail = input; }} />
								  </div>
								  <div className="form-group">
								    <label>รหัสผ่าน {passwordErrorMessage}</label>
								    <input type="password" className="form-control" ref={(input) => { this.inputPassword = input; }} />
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
      				<div className="text">เข้าสู่ระบบด้วย</div>
      				<div className="social-media">
      					<ul>
      						<li className="facebook"><a href="#" target="_blank"><FontAwesome name="facebook" /></a></li>
			      			<li className="google-plus"><a><FontAwesome name="google-plus" /></a></li>
			      			<li className="twitter"><a href="#" target="_blank"><FontAwesome name="twitter" /></a></li>
      					</ul>
      				</div>
      			</div>
      		</div>
      	</div>
      </div>
    );
  }
}

export default Login;