const initialState = {
  fetch: false,
  fetching: false,
  data: {},
  page: 1,
  limit: 10,
  total: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'DOMAIN/ACCOUNT_PROPERTY/FETCH': {
      return {
        ...state,
        fetch: action.fetch,
      };
    }

    case 'DOMAIN/ACCOUNT_PROPERTY/FETCHING': {
      return {
        ...state,
        fetching: action.fetching,
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

export default reducer;
