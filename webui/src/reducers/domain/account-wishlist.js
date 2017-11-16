import _ from 'lodash';

const initialState = {
  fetching: false,
  fetchStatus: '',
  data: [],
  account: {
    fetch: false,
    fetching: false,
    data: {},
    page: 1,
    limit: 10,
    total: 0,
  },
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

    case 'DOMAIN/ACCOUNT_WISHLIST/FETCH': {
      return {
        ...state,
        account: {
          ...state.account,
          fetch: action.fetch,
        },
      };
    }

    case 'DOMAIN/ACCOUNT_WISHLIST/FETCHING': {
      return {
        ...state,
        account: {
          ...state.account,
          fetching: action.fetching,
        },
      };
    }

    case 'DOMAIN/ACCOUNT_WISHLIST/RESULT_RECEIVED': {
      return {
        ...state,
        account: {
          ...state.account,
          data: action.result,
        },
      };
    }

    case 'DOMAIN/ACCOUNT_WISHLIST/TOTAL': {
      return {
        ...state,
        account: {
          ...state.account,
          total: action.total,
        },
      };
    }

    case 'DOMAIN/ACCOUNT_WISHLIST/PAGE': {
      return {
        ...state,
        account: {
          ...state.account,
          page: action.page,
        },
      };
    }

    default: return state;
  }
};

export default reducers;
