const initialState = {
  visibleIDs: [],
  total: 0,
  skip: 0,
  limit: 0,
};

const agents = (state = initialState, action) => {
  switch (action.type) {
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

export default agents;
