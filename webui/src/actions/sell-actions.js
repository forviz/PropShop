// import { createRealEstate } from '../api/contentful';
import _ from 'lodash';
import { createPost, createProperty, updateProperty } from '../api/property';
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

export const doCreateRealEstate = (sell, userId, userEmail, userName) => {
  return async (dispatch) => {
    dispatch(sendingData(true));
    dispatch(sendDataSuccess(''));

    if (_.get(sell, 'step2.mainImage.newImage')) {
      const mainImage = await uploadMediaAPI(_.get(sell, 'step2.mainImage.newImage'));
      if (_.get(mainImage, 'data.sys.id')) {
        _.set(sell, 'coverImageId', _.get(mainImage, 'data.sys.id'));
      }
    }

    if (_.get(sell, 'step2.images[0].newImage')) {
      const imagesId = await Promise.all(_.map(_.get(sell, 'step2.images'), async (value) => {
        const images = await uploadMediaAPI(value.newImage);
        return _.get(images, 'data.sys.id');
      }));
      _.set(sell, 'imagesId', imagesId);
    }

    createProperty(sell, userId, userEmail, userName).then((result) => {
      dispatch(sendingData(false));
      if (result.data.sys.id) {
        dispatch(sendDataSuccess('yes'));
      } else {
        dispatch(sendDataSuccess('no'));
      }
    });
  };
};

export const doUpdateProperty = (id, sell) => {
  return async (dispatch) => {
    dispatch(sendingData(true));
    dispatch(sendDataSuccess(''));

    if (_.get(sell, 'step2.mainImage.newImage')) {
      const mainImage = await uploadMediaAPI(_.get(sell, 'step2.mainImage.newImage'));
      if (_.get(mainImage, 'data.sys.id')) {
        _.set(sell, 'coverImageId', _.get(mainImage, 'data.sys.id'));
      }
    }

    if (_.get(sell, 'step2.images[0].newImage')) {
      const imagesId = await Promise.all(_.map(_.get(sell, 'step2.images'), async (value) => {
        const images = await uploadMediaAPI(value.newImage);
        return _.get(images, 'data.sys.id');
      }));
      _.set(sell, 'imagesId', imagesId);
    }

    updateProperty(id, sell).then((result) => {
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
