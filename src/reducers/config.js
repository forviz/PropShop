import _ from 'lodash';

const initalState = {
	loading: true,
	data: {},
}

const reducers = (state = initalState, action) => {
	switch (action.type) {
		case 'CONFIG/LOADING/SHOW': return {...state, loading: true };
		case 'CONFIG/LOADING/HIDE': return {...state, loading: false };
		case 'CONFIG/RECEIVED/SUCCESS': {
		  return {
		  	...state,
		  	data: action.items,
		  };
		}
		default:
			return state;
	}
}

export default reducers;