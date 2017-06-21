import * as firebase from 'firebase';
import * as contentful from './contentful';
import _ from 'lodash';

const config = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DATABASEURL,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
};

firebase.initializeApp(config);

const mapRegisterErrorMessage = (errorMessage) => {
	const data = [];
	data['The email address is already in use by another account.'] = 'คุณเคยสมัครอีเมลนี้แล้ว';
	data['Password should be at least 6 characters'] = 'รหัสผ่านควรมี 6 ตัวอักษรขึ้นไป';
	data['auth/user-not-found'] = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
	data['The password is invalid or the user does not have a password.'] = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
	data['There is no user record corresponding to this identifier. The user may have been deleted.'] = 'ไม่พบอีเมลนี้';
	return data[errorMessage] ? data[errorMessage] : errorMessage;
}

export const core = () => {
	return firebase;
}

export const createUser = (email, password) => {
	return firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
	  contentful.createUser(user).then((userContentful) => {
	  	window.location = "/";
	    // user.sendEmailVerification().then(function() {
	    //   window.location = "/";
	    // }, function(error) {
	    //   return error;
	    // });
	  });
	}).catch(function(error) {
		return mapRegisterErrorMessage(error.message);
	});
}

export const signIn = (email, password) => {
	return firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
	  window.location = "/";
	}).catch(function(error) {
	  return mapRegisterErrorMessage(error.message);
	});
}

export const forgotpassword = (email) => {
	return firebase.auth().sendPasswordResetEmail(email).then(function() {
	  return false;
	}, function(error) {
	  return mapRegisterErrorMessage(error.message);
	});
}

const getProviderForProviderId = (providerId) => {
	let provider = null;
	switch(providerId) {
		case 'facebook.com':
      provider = new firebase.auth.FacebookAuthProvider();
      provider.addScope('email');
      break;
    case 'google.com':
      provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/userinfo.email');
      break;
    case 'twitter.com':
      provider = new firebase.auth.TwitterAuthProvider();
      break;
    default:
      provider = new firebase.auth.FacebookAuthProvider();
	}
	return provider;
}

const differentCredential = async (provider, error) => {
	if (error.code === 'auth/account-exists-with-different-credential') {
    const pendingCred = error.credential;
    const email = error.email;
     return await firebase.auth().fetchProvidersForEmail(email).then(function(providers) {
      if (providers[0] === 'password') {
      	return {
      		type: 'auth/account-exists-with-different-credential',
      		message: 'คุณเคยสมัครอีเมลนี้แล้ว',
      		email: email,
      	};
      }
   		const provider = getProviderForProviderId(providers[0]);
   		signInWithProvider(provider);
    });
  }
}

const signInWithProvider = async (provider) => {
	return await firebase.auth().signInWithPopup(provider).then(function(result) {
	  // const token = result.credential.accessToken;
	  const user = result.user;
	  contentful.createUser(user).then((userContentful) => {
	  	window.location = "/";
	  });
	}).catch(function(error) {
		return differentCredential(provider, error).then((errorMessage) => {
	  	return errorMessage;
	  });
	});
}

export const signInWithFacebook = async () => {
	const provider = getProviderForProviderId('facebook.com');
	return await signInWithProvider(provider);
}

export const signInWithGoogle = async () => {
	const provider = getProviderForProviderId('google.com');
	return await signInWithProvider(provider);
}

export const signInWithTwitter = async () => {
	const provider = getProviderForProviderId('twitter.com');
	return await signInWithProvider(provider);
}