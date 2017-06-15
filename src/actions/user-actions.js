import * as firebase from '../api/firebase';
import { handleError } from './errors';

export const userServiceReturnWithSuccess = (user) => {
	return {
	  type: 'USER/RECEIVED/SUCCESS',
		user: user
	}
};

export const fetchUser = () => {
	return dispatch => {
    firebase.core().auth().onAuthStateChanged(function(user) {
      if (user) {
        dispatch(userServiceReturnWithSuccess(user));
      }
    });
	}
};