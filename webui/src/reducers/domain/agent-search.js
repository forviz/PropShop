const initialState = {
  searchResult: [],
};

const agents = (state = initialState, action) => {
  switch (action.type) {
    case 'DOMAIN/AGENT_SEARCH/RESULT_RECEIVED': {
      return {
        ...state,
        searchResult: action.ids,
      };
    }

    default: return state;
  }
};

export default agents;
