import { getConfigRealEstate } from '../api/contentful';
import { handleError } from './errors';

export const configShowLoading = () => {
  return { type: 'CONFIG/LOADING/SHOW' };
};

export const configHideLoading = () => {
  return { type: 'CONFIG/LOADING/HIDE' };
};

export const configServiceReturnWithSuccess = (result) => {
  return {
    type: 'CONFIG/RECEIVED/SUCCESS',
    items: result,
  };
};

export const fetchConfigs = () => {
  return (dispatch) => {
    dispatch(configShowLoading());
    getConfigRealEstate()
    .then((result) => {
      dispatch(configServiceReturnWithSuccess(result));
      dispatch(configHideLoading());
    })
    .catch((error) => {
      dispatch(handleError(error));
    });
  };
};
