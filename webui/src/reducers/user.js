import _ from 'lodash';

const initalState = {
  data: {},
};

const reducers = (state = initalState, action) => {
  switch (action.type) {
    case 'USER/SET/DATA': {
      return {
        ...state,
        data: {
          ...action.user,
          // verify: _.get(action.user, 'verify') ? _.get(action.user, 'verify') : false,
        },
      };
    }
    default:
      return state;
  }
};

export default reducers;
