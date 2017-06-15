import { getBannerRealEstate } from '../api/contentful';
import { handleError } from './errors';

export const bannerShowLoading = () => {
	return { type: 'BANNER/LOADING/SHOW' }
};

export const bannerHideLoading = () => {
	return { type: 'BANNER/LOADING/HIDE' }
};

export const bannerServiceReturnWithSuccess = (result) => {
	return {
	  type: 'BANNER/RECEIVED/SUCCESS',
		items: result
	}
};

export const fetchBanners = () => {
	return dispatch => {
		dispatch(bannerShowLoading());
		getBannerRealEstate()
		.then(result => {
			dispatch(bannerServiceReturnWithSuccess(result));
			dispatch(bannerHideLoading());
		})
		.catch(error => {
			dispatch(handleError(error));
		});
	}
};