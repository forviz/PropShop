import _ from 'lodash';

const initialState = {
  fetching: false,
  fetchStatus: '',
  data: [],
};

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case 'DOMAIN/WISHLIST/FETCHING': {
      return {
        ...state,
        fetching: action.fetching,
      };
    }

    case 'DOMAIN/WISHLIST/FETCH_STATUS': {
      return {
        ...state,
        fetchStatus: action.fetchStatus,
      };
    }

    case 'DOMAIN/WISHLIST/RESULT_RECEIVED': {
      return {
        ...state,
        data: _.uniqBy(action.items, 'id'),
      };
    }

    default: return state;
  }
};

export default reducers;
