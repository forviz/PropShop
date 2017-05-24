import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  firebaseConnect,
  isLoaded,
  isEmpty,
  dataToJS,
  pathToJS
} from 'react-redux-firebase';
import { compose } from 'redux';

import BannerRealEstate from '../../containers/BannerRealEstate';

import FontAwesome from 'react-fontawesome';


class Login extends Component {

	state = {

	}

  render() {

    const { firebase } = this.props;

    const user = firebase.auth().currentUser;

    console.log('Login', this.props);
    console.log('user_1', user);

    const email = 'asd@gmail.com';
    const password = '123456';

    // firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    //   // Handle Errors here.
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   console.log('errorCode', errorCode);
    //   console.log('errorMessage', errorMessage);
    //   // ...
    // });

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log('user_2', user);
        // User is signed in.
      } else {
        console.log('No user is signed in.');
        // No user is signed in.
      }
    });

    

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
								  <div className="form-group">
								    <label>ชื่อผู้ใช้ หรือ อีเมล</label>
								    <input type="text" className="form-control" />
								  </div>
								  <div className="form-group">
								    <label>รหัสผ่าน</label>
								    <input type="password" className="form-control" />
								  </div>
								  <div className="form-group link">
								  	<ul>
								  		<li><NavLink exact to="/">ลืมรหัสผ่าน?</NavLink></li>
								  		<li><NavLink exact to="/">สมัครสมาชิก</NavLink></li>
								  	</ul>
								  </div>
								  <div className="form-group action">
								  	<button className="btn btn-default">ยกเลิก</button>
								  	<button className="btn btn-primary">ตกลง</button>
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
			      			<li className="google-plus"><a href="#" target="_blank"><FontAwesome name="google-plus" /></a></li>
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

export default compose(
  firebaseConnect(['/test']),
  connect(
    ({firebase}) => ({ 
      test: dataToJS(firebase, '/test'),
    })
  )
)(Login)