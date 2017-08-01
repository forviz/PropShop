import * as firebase from 'firebase';
import * as contentful from './contentful';
import * as UserActions from '../actions/user-actions';

const config = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DATABASEURL,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
};

firebase.initializeApp(config);

export const mapFirebaseErrorMessage = (errorMessage) => {
  const data = [];
  data['The email address is already in use by another account.'] = 'คุณเคยสมัครอีเมลนี้แล้ว';
  data['Password should be at least 6 characters'] = 'รหัสผ่านควรมี 6 ตัวอักษรขึ้นไป';
  data['auth/user-not-found'] = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
  data['The password is invalid or the user does not have a password.'] = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
  data['There is no user record corresponding to this identifier. The user may have been deleted.'] = 'ไม่พบอีเมลนี้';
  data['createUserWithEmailAndPassword failed: Second argument "password" must be a valid string.'] = 'รหัสผ่านต้องเป็นภาษาอังกฤษเท่านั้น';
  return data[errorMessage] ? data[errorMessage] : errorMessage;
}

export const core = () => {
  return firebase;
}

export const createUser = (username, email, password) => {
  return firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
    user['username'] = username;
    return contentful.createUser(user).then((userContentful) => { // create user to contentful
      // window.location = "/";
      return user.sendEmailVerification().then(function() { // firebase send mail verification
        return;
        // window.location = "/";
      }, function(error) {
        return error;
      });
    });
  }).catch(function(error) {
    return mapFirebaseErrorMessage(error.message);
  });
}

export const signIn = (email, password) => {
  return firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
    window.location = "/";
  }).catch(function(error) {
    return mapFirebaseErrorMessage(error.message);
  });
};

export const forgotpassword = (email) => {
  return firebase.auth().sendPasswordResetEmail(email).then(() => {
    return false;
  }, (error) => {
    return mapFirebaseErrorMessage(error.message);
  });
};

const getProviderForProviderId = (providerId) => {
  let provider = null;
  switch (providerId) {
    case 'facebook.com':
      provider = new firebase.auth.FacebookAuthProvider();
      provider.addScope('public_profile');
      provider.addScope('email');
      break;
    case 'google.com':
      provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      break;
    case 'twitter.com':
      provider = new firebase.auth.TwitterAuthProvider();
      break;
    default:
      provider = new firebase.auth.FacebookAuthProvider();
      provider.addScope('public_profile');
      provider.addScope('email');
  }
  return provider;
};

const signInWithProvider = async (provider) => {
  const data = await firebase.auth().signInWithPopup(provider).then((result) => {
    // const token = result.credential.accessToken;
    const user = result.user;
    user.username = result.displayName ? result.displayName : result.email;
    UserActions.fetchUserData(user.uid);
    contentful.createUser(user).then(() => {
      return false;
    });
  }).catch((error) => {
    return differentCredential(provider, error).then((errorMessage) => {
      return errorMessage;
    });
  });
  return data;
};

const differentCredential = async (provider, error) => {
  if (error.code === 'auth/account-exists-with-different-credential') {
    const email = error.email;
    const result = await firebase.auth().fetchProvidersForEmail(email).then((providers) => {
      if (providers[0] === 'password') {
        return {
          type: 'auth/account-exists-with-different-credential',
          message: 'คุณเคยสมัครอีเมลนี้แล้ว',
          email,
        };
      }
      signInWithProvider(getProviderForProviderId(providers[0]));
      return true;
    });
    return result;
  }
  return true;
};

export const signInWithFacebook = async () => {
  const provider = getProviderForProviderId('facebook.com');
  const result = await signInWithProvider(provider);
  return result;
};

export const signInWithGoogle = async () => {
  const provider = getProviderForProviderId('google.com');
  const result = await signInWithProvider(provider);
  return result;
};

export const signInWithTwitter = async () => {
  const provider = getProviderForProviderId('twitter.com');
  const result = await signInWithProvider(provider);
  return result;
};

export const verifiedUser = (user) => {
  let verified = false;
  if (user) {
    if (user.providerData[0].providerId === 'password') {
      if (user.emailVerified === true) {
        verified = true;
      }
    } else {
      if (user.email) {
        verified = true;
      }
    }
  }
  return verified;
}

export const updatePassword = (newPassword) => {
  return firebase.auth().currentUser.updatePassword(newPassword).then(function() {
    return;
  }, function(error) {
    return error;
  });
}