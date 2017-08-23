import _ from 'lodash';
import { getProperties } from '../modules/property/api';
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

export const fetchPropertiesByAgent = (userId, skip, limit) => {
  return (dispatch) => {
    dispatch(fetchingAccountProperty(true));
    dispatch(receiveAccountProperty([]));
    getProperties(`?agentId=${userId}&skip=${skip}&limit=${limit}&order=-sys.updatedAt`)
    .then((result) => {
      dispatch(fetchingAccountProperty(false));
      if (_.size(result.data) > 0) {
        dispatch(receiveAccountProperty(result.data));
        dispatch(totalAccountProperty(result.total));
        dispatch(pageAccountProperty(skip + 1));
        dispatch(resultAccountProperty('ok'));
      } else {
        dispatch(resultAccountProperty('no'));
      }
    })
    .catch((error) => {
      dispatch(handleError(error));
    });
  };
};

export const fetchPropertiesById = (id) => {
  return (dispatch) => {
    getProperties(`?id=${id}`)
    // getProperties(`?id=${id}&realTime=1`)
    .then((result) => {
      if (result.total === 1) {
        dispatch({
          type: 'SELL/SET/FORM',
          data: result.data[0],
        });
      }
    })
    .catch((error) => {
      dispatch(handleError(error));
    });
  };
};
