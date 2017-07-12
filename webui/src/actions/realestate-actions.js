import { getRealEstate } from '../api/contentful';
import { getProperties } from '../api/property';
import { handleError } from './errors';

export const realestateFilter = (filter) => {
  return {
    type: 'REALESTATE/FILTER',
    filter,
  };
};

export const realestateLoading = (loading) => {
  return {
    type: 'REALESTATE/LOADING',
    loading,
  };
};

export const realestateServiceReturnWithSuccess = (result) => {
  return {
    type: 'REALESTATE/RECEIVED/SUCCESS',
    items: result,
  };
};

export const propertyServiceReturnWithSuccess = (result) => {
  return {
    type: 'PROPERTY/RECEIVED/SUCCESS',
    items: result,
  };
};

export const fetchRealestates = (search) => {
  return (dispatch) => {
    dispatch(realestateFilter(true));
    dispatch(realestateLoading(true));
    getRealEstate(search)
    .then((result) => {
      console.log('fetchRealestates', result);
      dispatch(realestateServiceReturnWithSuccess(result));
      dispatch(realestateLoading(false));
    })
    .catch((error) => {
      dispatch(handleError(error));
    });

    getProperties(search)
    .then((result) => {
      dispatch(propertyServiceReturnWithSuccess(result));
      dispatch(realestateLoading(false));
    })
    .catch((error) => {
      dispatch(handleError(error));
    });
  };
};
