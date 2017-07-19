import { fetchUserAPI, updateUserAPI } from '../api/user';
import { uploadMediaAPI, deleteMediaAPI } from '../api/media';

const setFormData = (user) => {
  return {
    type: 'DOMAIN/ACCOUNT_PROFILE/SET/FORM',
    user,
  };
};

export const fetchUserProfile = (uid) => {
  return (dispatch) => {
    fetchUserAPI(uid).then((user) => {
      dispatch(setFormData(user));
    });
  };
};

const setInputData = (key, value) => {
  return {
    type: 'DOMAIN/ACCOUNT_PROFILE/SET/DATA',
    key,
    value,
  };
};

export const inputUserData = (key, value) => {
  return (dispatch) => {
    dispatch(setInputData(key, value));
  };
};

const profileEditing = (editing) => {
  return {
    type: 'DOMAIN/ACCOUNT_PROFILE/EDITING',
    editing,
  };
};

const profileEditSuccess = (editSuccess) => {
  return {
    type: 'DOMAIN/ACCOUNT_PROFILE/EDIT_SUCCESS',
    editSuccess,
  };
};

const setErrorMessage = (errorMessage) => {
  return {
    type: 'DOMAIN/ACCOUNT_PROFILE/ERROR_MESSAGE',
    errorMessage,
  };
};

export const updateUserProfile = (id, data) => {
  return (dispatch) => {
    dispatch(setErrorMessage(''));
    dispatch(profileEditing(true));
    dispatch(profileEditSuccess(false));
    updateUserAPI(id, data).then((result) => {
      dispatch(profileEditing(false));
      if (result.status === 'SUCCESS') {
        dispatch(profileEditSuccess(true));
      } else {
        dispatch(setErrorMessage('แก้ไขข้อมูลส่วนตัวล้มเหลว'));
        dispatch(profileEditSuccess(false));
      }
    });
  };
};

export const updateAvatar = (file, fileName, assetId = '') => {
  return (dispatch) => {
    dispatch(setErrorMessage(''));
    dispatch(profileEditing(true));
    dispatch(profileEditSuccess(false));
    uploadMediaAPI(file, fileName).then((result) => {
      dispatch(profileEditing(false));
      if (result.status === 'success') {
        deleteMediaAPI(assetId);
        dispatch(profileEditSuccess(true));
      } else {
        dispatch(setErrorMessage('อัพโหลดรูปภาพล้มเหลว'));
        dispatch(profileEditSuccess(false));
      }
    });
  };
};
