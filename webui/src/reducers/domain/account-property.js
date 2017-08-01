const initialState = {
  fetching: false,
  result: '', // ok, no
  data: [],
  page: 1,
  limit: 10,
  total: 0,
};

const agents = (state = initialState, action) => {
  switch (action.type) {
    case 'DOMAIN/ACCOUNT_PROPERTY/FETCHING': {
      return {
        ...state,
        fetching: action.fetching,
      };
    }

    case 'DOMAIN/ACCOUNT_PROPERTY/RESULT': {
      return {
        ...state,
        result: action.result,
      };
    }

    case 'DOMAIN/ACCOUNT_PROPERTY/RESULT_RECEIVED': {
      return {
        ...state,
        data: action.result,
      };
    }

    case 'DOMAIN/ACCOUNT_PROPERTY/TOTAL': {
      return {
        ...state,
        total: action.total,
      };
    }

    case 'DOMAIN/ACCOUNT_PROPERTY/PAGE': {
      return {
        ...state,
        page: action.page,
      };
    }

    default: return state;
  }
};

export default agents;
