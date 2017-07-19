import { fetchUserAPI } from '../api/user';

const setUserData = (user) => {
  return {
    type: 'USER/SET/DATA',
    user,
  };
};

export const fetchUserData = (uid) => {
  return (dispatch) => {
    fetchUserAPI(uid).then((user) => {
      dispatch(setUserData(user));
    });
  };
};

export const emptyUser = () => {
  return (dispatch) => {
    dispatch(setUserData({}));
  };
};
