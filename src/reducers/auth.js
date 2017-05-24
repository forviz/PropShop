import _ from 'lodash';

const initialState = {
	login: false,
	data: {},
};

export default (state = initialState, action) => {
	switch (action.type) {

		case 'AUTH/LOGIN': {
			return {
				...state,
				login: true,
				data: action.data,
			}
		}

		case 'AUTH/LOGOUT': {
			return {
				...state,
				login: false,
				data: {},
			}
		}

		default: return state;
	}
}