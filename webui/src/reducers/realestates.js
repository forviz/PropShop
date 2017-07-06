const initalState = {
  filter: false,
  loading: false,
  data: {},
};

const reducers = (state = initalState, action) => {
  switch (action.type) {
    case 'REALESTATE/FILTER': return { ...state, filter: action.filter };
    case 'REALESTATE/LOADING': return { ...state, loading: action.loading };
    case 'REALESTATE/RECEIVED/SUCCESS': {
      return {
        ...state,
        data: action.items,
      };
    }
    default:
      return state;
  }
};

export default reducers;
