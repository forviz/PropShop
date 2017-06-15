import { combineReducers } from 'redux';
import { IntlReducer as Intl } from 'react-redux-multilingual';
// import user from './user';
import config from './config';
import banners from './banners';
import realestates from './realestates';
import sell from './sell';

export default combineReducers({
	Intl,
	config,
	// user,
	banners,
	realestates,
	sell,
});