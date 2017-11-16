import _ from 'lodash';

const initalState = {
  policy: {
    fetching: false,
    fetchStatus: '', // success, fail
    data: '',
  },
  agreement: {
    fetching: false,
    fetchStatus: '', // success, fail
    data: '',
  },
};

const reducers = (state = initalState, action) => {
  switch (action.type) {
    case 'CONTENT/FETCHING': {
      return {
        ...state,
        [action.content]: {
          ...state[action.content],
          fetching: action.fetching,
        },
      };
    }
    case 'CONTENT/FETCH/STATUS': {
      return {
        ...state,
        [action.content]: {
          ...state[action.content],
          fetchStatus: action.fetchStatus,
        },
      };
    }
    case 'CONTENT/SET/DATA': {
      return {
        ...state,
        [action.content]: {
          ...state[action.content],
          data: action.data,
        },
      };
    }
    default:
      return state;
  }
};

export default reducers;
