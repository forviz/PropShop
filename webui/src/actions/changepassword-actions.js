import * as firebase from '../api/firebase';

const setChangePasswordError = (message) => {
  return {
    type: 'DOMAIN/ACCOUNT_CHANGEPASSWORD/ERROR',
    message,
  };
};

export const changePasswordError = (message) => {
  return (dispatch) => {
    dispatch(setChangePasswordError(message));
  };
};

const setinputForm = (key, value) => {
  return {
    type: 'DOMAIN/ACCOUNT_CHANGEPASSWORD/SET/DATA',
    key,
    value,
  };
};

export const inputForm = (key, value) => {
  return (dispatch) => {
    dispatch(setinputForm(key, value));
  };
};

const passwordEditing = (editing) => {
  return {
    type: 'DOMAIN/ACCOUNT_CHANGEPASSWORD/EDITING',
    editing,
  };
};

const passwordEditSuccess = (editSuccess) => {
  return {
    type: 'DOMAIN/ACCOUNT_CHANGEPASSWORD/EDIT/SUCCESS',
    editSuccess,
  };
};

export const changePassword = (user, newPassword) => {
  return (dispatch) => {
    dispatch(passwordEditing(true));
    user.updatePassword(newPassword).then(() => {
      dispatch(passwordEditSuccess(true));
      dispatch(passwordEditing(false));
    }, (error) => {
      dispatch(passwordEditSuccess(false));
      dispatch(passwordEditing(false));
      dispatch(setChangePasswordError(firebase.mapFirebaseErrorMessage(error.message)));
    });
  };
};

export const clearState = () => {
  return (dispatch) => {
    dispatch({
      type: 'DOMAIN/ACCOUNT_CHANGEPASSWORD/CLEAR',
    });
  };
};
