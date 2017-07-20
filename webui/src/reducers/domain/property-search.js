const initialState = {
  visibleIDs: [],
  loading: false,
  total: 0,
  skip: 0,
  limit: 0,
};

const propertySearch = (state = initialState, action) => {
  switch (action.type) {
    case 'REALESTATE/LOADING': {
      return { ...state, loading: action.loading };
    }

    case 'DOMAIN/PROPERTY_SEARCH/RESULT_RECEIVED': {
      return {
        ...state,
        visibleIDs: action.itemIds,
        total: action.total,
      };
    }

    default: return state;
  }
};

export default propertySearch;
