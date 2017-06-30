import { createRealEstate } from '../api/contentful';
import { createPost } from '../api/property';

const goSaveStep = (step, data) => {
  return {
    type: 'SELL/STEP/SAVE',
    step,
    data,
  };
};

const sendingData = (status) => {
  return {
    type: 'SELL/DATA/SENDING',
    status: status
  };
};

export const sendDataSuccess = (status) => {
  return {
    type: 'SELL/DATA/SEND/SUCCESS',
    status: status
  };
};

const redirect = () => {
  return { type: 'SELL/REDIRECT' };
};

export const saveStep = (step, data) => (dispatch) => {
  dispatch(goSaveStep(step, data));
  return Promise.resolve();
};

export const nextStep = () => {
  return (dispatch) => {
    dispatch({ type: 'SELL/STEP/NEXT' });
  }
};

export const prevStep = () => {
  return (dispatch) => {
    dispatch({ type: 'SELL/STEP/PREV' });
  }
};

export const addRequiredField = (field) => {
  return (dispatch) => {
    dispatch({
      type: 'SELL/REQUIREDFIELD/ADD',
      field,
    });
  };
};

export const removeRequiredField = (field) => {
  return (dispatch) => {
    dispatch({
      type: 'SELL/REQUIREDFIELD/REMOVE',
      field,
    });
  };
};

export const doCreateRealEstate = (sell, user) => {
  return (dispatch) => {
    dispatch(sendingData(true));
    // createRealEstate(sell, user).then(result => {
    //   dispatch(sendDataSuccess(true));
    //   dispatch(sendingData(false));
    // });

    createPost(sell, user).then((result) => {
      console.log('create post success', result);
      dispatch(sendDataSuccess());
    }).catch((error) => {
      // dispatch(sendDataSuccess());
      console.log('error', error);
    })
  }
}
