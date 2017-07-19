import _ from 'lodash';
import * as UserActions from './user-actions';
import * as contentful from '../api/contentful';
import { getProperties, getPropertyById } from '../api/property';
import { handleError } from './errors';

export const receivePropertyEntity = (propertyId, property) => {
  return {
    type: 'ENTITY/PROPERTY/RECEIVED',
    propertyId,
    property,
  };
};

const receiveAccountProperty = (result) => {
  return {
    type: 'DOMAIN/ACCOUNT_PROPERTY/RESULT_RECEIVED',
    result,
  };
};

const fetchingAccountProperty = (fetching) => {
  return {
    type: 'DOMAIN/ACCOUNT_PROPERTY/FETCHING',
    fetching,
  };
};

const resultAccountProperty = (result) => {
  return {
    type: 'DOMAIN/ACCOUNT_PROPERTY/RESULT',
    result,
  };
};

const totalAccountProperty = (total) => {
  return {
    type: 'DOMAIN/ACCOUNT_PROPERTY/TOTAL',
    total,
  };
};

const pageAccountProperty = (page) => {
  return {
    type: 'DOMAIN/ACCOUNT_PROPERTY/PAGE',
    page,
  };
};

export const fetchPropertiesByAgent = (user, skip, limit) => {
  return (dispatch, getState) => {
    dispatch(fetchingAccountProperty(true));
    contentful.getUserData(user.uid).then((userData) => {
      dispatch(UserActions.setUserData(UserActions.mapUserData(user, userData)));
      const id = getState().user.data.id;
      getProperties(`?agentId=${id}&skip=${skip}&limit=${limit}`)
      .then((result) => {
        if (_.size(result.data) > 0) {
          dispatch(receiveAccountProperty(result.data));
          dispatch(totalAccountProperty(result.total));
          dispatch(pageAccountProperty(skip + 1));
          dispatch(resultAccountProperty('ok'));
        } else {
          dispatch(resultAccountProperty('no'));
        }
        dispatch(fetchingAccountProperty(false));
      })
      .catch((error) => {
        dispatch(handleError(error));
      });
    });
  };
};

export const fetchPropertiesById = (id) => {
  return (dispatch, getState) => {
    // dispatch(fetchingAccountProperty(true));
    getPropertyById(id)
    .then((result) => {
      console.log('fetchPropertiesById', result);
      // if (_.size(result) > 0) {
      //   dispatch(receiveAccountProperty(result));
      //   dispatch(resultAccountProperty('ok'));
      // } else {
      //   dispatch(resultAccountProperty('no'));
      // }
      // dispatch(fetchingAccountProperty(false));
    })
    .catch((error) => {
      dispatch(handleError(error));
    });
  };
};
