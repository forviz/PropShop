const initialState = {
  fetching: false,
  result: '', // ok, no
  data: {},
};

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case 'DOMAIN/ACCOUNT_PROPERTY_EDIT/FETCHING': {
      return {
        ...state,
        fetching: action.fetching,
      };
    }

    case 'DOMAIN/ACCOUNT_PROPERTY_EDIT/RESULT': {
      return {
        ...state,
        result: action.result,
      };
    }

    case 'DOMAIN/ACCOUNT_PROPERTY_EDIT/RESULT_RECEIVED': {
      return {
        ...state,
        data: action.result,
      };
    }

    default: return state;
  }
};

export default reducers;
