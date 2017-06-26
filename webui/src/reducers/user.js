import _ from 'lodash';

const initalState = {
	data: {},
}

const reducers = (state = initalState, action) => {
	switch (action.type) {
		case 'USER/RECEIVED/SUCCESS': {
		  return {
		  	...state,
		  	data: action.user,
		  };
		}
		default:
			return state;
	}
}

export default reducers;