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

const fetchAccountProperty = (fetch) => {
  return {
    type: 'DOMAIN/ACCOUNT_PROPERTY/FETCH',
    fetch,
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
  return async (dispatch) => {
    dispatch(fetchAccountProperty(false));
    dispatch(fetchingAccountProperty(true));
    dispatch(receiveAccountProperty({}));
    const result = await getProperties(`?agentId=${userId}&skip=${skip}&limit=${limit}&order=-sys.updatedAt`);
    dispatch(fetchAccountProperty(true));
    dispatch(fetchingAccountProperty(false));
    if (_.size(result.data) > 0) {
      dispatch(receiveAccountProperty(result.data));
      dispatch(totalAccountProperty(result.total));
      dispatch(pageAccountProperty(skip + 1));
    }
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
