import * as firebase from 'firebase';
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

export const core = () => {
	return firebase;
}

export const createUser = (email, password) => {
	return firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
		return error;
	});
}

export const signIn = (email, password) => {
	return firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
	  return error;
	});
}