import * as firebase from '../api/firebase';
import * as contentful from '../api/contentful';

const profileEditing = (editing) => {
  return {
    type: 'PROFILE/EDITING',
    editing,
  };
};

const profileEditSuccess = (editSuccess) => {
  return {
    type: 'PROFILE/EDIT/SUCCESS',
    editSuccess,
  };
};

const setFormData = (user) => {
  return {
    type: 'PROFILE/SET/FORM',
    user,
  };
};

const setInputData = (key, value) => {
  return {
    type: 'PROFILE/SET/DATA',
    key,
    value,
  };
};

const setUserData = (user) => {
  return {
    type: 'USER/SET/DATA',
    user,
  };
};

const mapUserData = (firebaseUser, contentfulUser) => {
  return {
    ...contentfulUser,
    ...firebaseUser,
    providerId: firebaseUser.providerData[0].providerId
  }
};

export const inputUserData = (key, value) => {
  return (dispatch) => {
    dispatch(setInputData(key, value));
  };
};

export const fetchUserProfile = (userFirebase) => {
  return (dispatch) => {
    contentful.getUserData(userFirebase.uid).then((userContentful) => {
      dispatch(setFormData(userContentful));
      dispatch(setUserData(mapUserData(userFirebase, userContentful)));
    });
  };
};

export const updateUserProfile = (id, data) => {
  return (dispatch) => {
    dispatch(profileEditing(true));
    dispatch(profileEditSuccess(false));
    contentful.updateAgent(id, data).then((userUpdate) => {
      fetchUserProfile();
      dispatch(profileEditing(false));
      dispatch(profileEditSuccess(true));
    });
  };
}

export const fetchUser = () => {
  return (dispatch) => {
    firebase.core().auth().onAuthStateChanged((user) => {
      contentful.getUserData(user.uid).then((userData) => {
        dispatch(setUserData(mapUserData(user, userData)));
      });
    });
  };
};

export const logout = () => {
  return (dispatch) => {
    firebase.core().auth().signOut().then(function() {
      dispatch(setUserData({}));
    });
  }
}

const setFormChangepassowrd = (key, value) => {
  return {
    type: 'PASSWORD/SET/DATA',
    key,
    value,
  };
};

export const inputFormChangepassowrd = (key, value) => {
  return (dispatch) => {
    dispatch(setFormChangepassowrd(key, value));
  };
};

const passwordEditing = (editing) => {
  return {
    type: 'PASSWORD/EDITING',
    editing,
  };
};

const passwordEditSuccess = (editSuccess) => {
  return {
    type: 'PASSWORD/EDIT/SUCCESS',
    editSuccess,
  };
};


export const setPasswordError = (message) => {
  return {
    type: 'PASSWORD/ERROR',
    message,
  };
};

export const changePassword = (newPassword) => {
  return (dispatch) => {
    dispatch(passwordEditing(true));
    firebase.core().auth().currentUser.updatePassword(newPassword).then(function() {
      dispatch(passwordEditSuccess(true));
      dispatch(passwordEditing(false));
    }, function(error) {
      dispatch(passwordEditSuccess(false));
      dispatch(passwordEditing(false));
      dispatch(setPasswordError(firebase.mapFirebaseErrorMessage(error.message)));
    });
  }
}
