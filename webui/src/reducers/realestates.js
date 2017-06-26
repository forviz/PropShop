import _ from 'lodash';

const initalState = {
	filter: false,
	loading: false,
	data: {},
}

const reducers = (state = initalState, action) => {
	switch (action.type) {
		case 'REALESTATE/FILTER/YES': return {...state, filter: true };
		case 'REALESTATE/FILTER/NO': return {...state, filter: false };
		case 'REALESTATE/LOADING/SHOW': return {...state, loading: true };
		case 'REALESTATE/LOADING/HIDE': return {...state, loading: false };
		case 'REALESTATE/RECEIVED/SUCCESS': {
		  return {
		  	...state,
		  	data: action.items,
		  };
		}
		// case 'REALESTATE/RECEIVED/SUCCESS': {
		// 	return {
		//   	...state,
		//   	entities: _.reduce(entitie, (acc, elem) => {
		//   		return {
		//   			...acc,
		//   			[elem.sys.id]: elem.fields,
		//   		}
		//   	}, state.entities),
		//   	display: _.map(display, elem => elem.sys.id),
		//   };
		  
		// }
		default:
			return state;
	}
}

export default reducers;