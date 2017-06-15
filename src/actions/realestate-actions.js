import { getRealEstate } from '../api/contentful';
import { handleError } from './errors';

export const realestateFilterYes = () => {
	return { type: 'REALESTATE/FILTER/YES' }
};

export const realestateFilterNo = () => {
	return { type: 'REALESTATE/FILTER/NO' }
};

export const realestateShowLoading = () => {
	return { type: 'REALESTATE/LOADING/SHOW' }
};

export const realestateHideLoading = () => {
	return { type: 'REALESTATE/LOADING/HIDE' }
};

export const realestateServiceReturnWithSuccess = (result) => {
	return {
	  type: 'REALESTATE/RECEIVED/SUCCESS',
		items: result
	}
};

export const fetchRealestates = (search) => {
	return (dispatch) => {
		dispatch(realestateFilterYes());
		dispatch(realestateShowLoading());
		getRealEstate(search)
		.then(result => {
			dispatch(realestateServiceReturnWithSuccess(result));
			dispatch(realestateHideLoading());
		})
		.catch(error => {
			dispatch(handleError(error));
		});
	}
};