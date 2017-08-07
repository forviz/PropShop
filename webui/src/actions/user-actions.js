import { fetchUserAPI } from '../api/user';

const setUserData = (user) => {
  return {
    type: 'USER/SET/DATA',
    user,
  };
};

const userFetchSuccess = (fetchSuccess) => {
  return {
    type: 'USER/FETCH/SUCCESS',
    fetchSuccess,
  };
};

export const fetchUserData = (uid) => {
  return (dispatch) => {
    dispatch(userFetchSuccess(false));
    if (uid) {
      fetchUserAPI(uid).then((user) => {
        dispatch(setUserData(user));
        dispatch(userFetchSuccess(true));
      });
    } else {
      dispatch(setUserData({}));
      dispatch(userFetchSuccess(true));
    }
  };
};

export const emptyUser = () => {
  return (dispatch) => {
    dispatch(setUserData({}));
  };
};
