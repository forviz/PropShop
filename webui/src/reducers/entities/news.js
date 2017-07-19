const initialState = {
  entities: {},
  fetching: false,
  fetchStatus: {},
  errors: {},
};

const news = (state = initialState, action) => {
  switch (action.type) {
    case 'NEWS/FETCHING': {
      return {
        ...state,
        fetching: action.fetching,
      };
    }
    case 'NEWS/PROP/RECEIVED': {
      const tab = [action.prop.tab];
      return {
        ...state,
        entities: {
          ...state.entities,
          [tab]: {
            datas: action.prop.data,
            total: action.prop.total,
          },
        },
        fetchStatus: {
          ...state.fetchStatus,
        },
      };
    }
    case 'NEWS/BANNER/RECEIVED': {
      return {
        ...state,
        entities: {
          ...state.entities,
          newsBanner: {
            datas: action.prop.data,
          },
        },
        fetchStatus: {
          ...state.fetchStatus,
        },
      };
    }

    default: return state;
  }
};

export default news;
