// import { createRealEstate } from '../api/contentful';
import _ from 'lodash';
import { createPost, createProperty } from '../api/property';
import { uploadMediaAPI } from '../api/media';

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
    status,
  };
};

export const sendDataSuccess = (status) => {
  return {
    type: 'SELL/DATA/SEND/SUCCESS',
    status,
  };
};

export const saveStep = (step, data) => (dispatch) => {
  dispatch(goSaveStep(step, data));
  return Promise.resolve();
};

export const nextStep = () => {
  return (dispatch) => {
    dispatch({ type: 'SELL/STEP/NEXT' });
  };
};

export const prevStep = () => {
  return (dispatch) => {
    dispatch({ type: 'SELL/STEP/PREV' });
  };
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

export const doCreateRealEstate = (sell, userId) => {
  return async (dispatch) => {
    dispatch(sendingData(true));
    dispatch(sendDataSuccess(''));

    if (_.size(_.get(sell, 'step2.mainImage')) > 0) {
      const mainImage = await uploadMediaAPI(_.get(sell, 'step2.mainImage'));
      if (_.get(mainImage, 'data.sys.id')) {
        _.set(sell, 'coverImageId', _.get(mainImage, 'data.sys.id'));
      }
    }

    if (_.size(_.get(sell, 'step2.images')) > 0) {
      const imagesId = await Promise.all(_.map(_.get(sell, 'step2.images'), async (file) => {
        const images = await uploadMediaAPI(file);
        return _.get(images, 'data.sys.id');
      }));
      _.set(sell, 'imagesId', imagesId);
    }

    createProperty(sell, userId).then((result) => {
      dispatch(sendingData(false));
      if (result.data.sys.id) {
        dispatch(sendDataSuccess('yes'));
      } else {
        dispatch(sendDataSuccess('no'));
      }
    });
  };
};

export const clearForm = () => {
  return (dispatch) => {
    dispatch({
      type: 'SELL/CLEAR/FORM',
    });
  };
};
