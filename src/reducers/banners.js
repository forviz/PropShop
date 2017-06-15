import _ from 'lodash';

const initalState = {
	loading: true,
	main: [],
	condo: {},
	house: {},
}

const reducers = (state = initalState, action) => {
	switch (action.type) {
		case 'BANNER/LOADING/SHOW': return {...state, loading: true };
		case 'BANNER/LOADING/HIDE': return {...state, loading: false };
		case 'BANNER/RECEIVED/SUCCESS': {
		  return {
		  	...state,
		  	main: action.items.main,
		  	condo: action.items.condo,
		  	house: action.items.house,
		  };
		}
		default:
			return state;
	}
}

export default reducers;