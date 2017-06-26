import * as firebase from '../api/firebase';

export const userServiceReturnWithSuccess = (user) => {
  return {
    type: 'USER/RECEIVED/SUCCESS',
    user,
  };
};

export const fetchUser = () => {
  return (dispatch) => {
    firebase.core().auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch(userServiceReturnWithSuccess(user));
      }
    });
  };
};
