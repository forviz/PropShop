import _ from 'lodash';

const initalState = {
  data: {},
  fetchSuccess: false,
};

const reducers = (state = initalState, action) => {
  switch (action.type) {
    case 'USER/SET/DATA': {
      if (_.get(action.user, 'emailVerified') === true) _.set(action.user, 'verify', true);
      return {
        ...state,
        data: {
          ...action.user,
        },
      };
    }
    case 'USER/FETCH/SUCCESS': {
      return {
        ...state,
        fetchSuccess: action.fetchSuccess,
      };
    }
    default:
      return state;
  }
};

export default reducers;
