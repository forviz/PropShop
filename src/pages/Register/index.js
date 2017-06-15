import React, { Component } from 'react';
import { Alert } from 'antd';
import { NavLink, Redirect } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';

import * as firebase from '../../api/firebase';
import * as contentful from '../../api/contentful';
import * as helpers from '../../helpers';

import BannerRealEstate from '../../containers/BannerRealEstate';

class Register extends Component {

  constructor(props) {
    super(props)
    this.submit = this.submit.bind(this);
  }

  state = {
    errorMessage: '',
    email: {
      errorMessage: '',
    },
    password1: {
      errorMessage: '',
    },
    password2: {
      errorMessage: '',
    }
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
      password1: {
        errorMessage: errorMessage,
      }
    }));
    return errorMessage;
  }

  checkConfirmPassword = (password1, password2) => {
    const errorMessage = helpers.errorMessageInputConfirmPassword(password1, password2);
    this.setState(prevState => ({
      password2: {
        errorMessage: errorMessage,
      }
    }));
    return errorMessage;
  }

  submit() {
    const { history } = this.props;

    const _self = this;
    
    const email = this.inputEmail.value;
    const password1 = this.inputPassword1.value;
    const password2 = this.inputPassword2.value;

    const errorEmail = this.checkEmail(email);
    this.checkPassword(password1);
    const errorPassword = this.checkConfirmPassword(password1, password2);

    if ( errorEmail === '' && errorPassword === '' ) {
      firebase.createUser(email, password1).then(function(user) {
        if ( user.message ) {
          _self.setState(prevState => ({
            errorMessage: user.message
          }));
        } else {
          contentful.createUser(user).then((newUserData) => {
            history.push({
              pathname: '/',
            });
          });
        }
      }).catch(function(error) {
        
      });
    }
  }

  render() {

    const emailErrorMessage = this.state.email.errorMessage ? <span className="text-red">({this.state.email.errorMessage})</span> : '';
    const password1ErrorMessage = this.state.password1.errorMessage ? <span className="text-red">({this.state.password1.errorMessage})</span> : '';
    const password2ErrorMessage = this.state.password2.errorMessage ? <span className="text-red">({this.state.password2.errorMessage})</span> : '';

    return (
      <div id="Register">
      	<div className="row">
      		<div className="col-md-6 layout-left">
      			<BannerRealEstate />
      		</div>
      		<div className="col-md-6 col-md-offset-6 layout-right">
      			<div className="form">
      				<div className="row">
      					<div className="col-md-6 col-md-offset-3">
      						<h1>สมัครสมาชิก</h1>
                  {this.state.errorMessage !== '' &&
                    <Alert message={this.state.errorMessage} type="error" />
                  }
								  <div className="form-group">
								    <label><span className="text-red">*</span> อีเมล {emailErrorMessage}</label>
								    <input type="text" className="form-control" ref={(input) => { this.inputEmail = input; }} />
								  </div>
								  <div className="form-group">
								    <label><span className="text-red">*</span> รหัสผ่าน {password1ErrorMessage}</label>
								    <input type="password" className="form-control" ref={(input) => { this.inputPassword1 = input; }} />
								  </div>
                  <div className="form-group">
                    <label><span className="text-red">*</span> ยืนยันรหัสผ่าน {password2ErrorMessage}</label>
                    <input type="password" className="form-control" ref={(input) => { this.inputPassword2 = input; }} />
                  </div>
								  <div className="form-group action">
								  	<button className="btn btn-primary" onClick={this.submit} >ตกลง</button>
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

export default Register;