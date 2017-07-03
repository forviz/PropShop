const initialState = {
  entities: {},
  fetchStatus: {},
  errors: {},
};

const news = (state = initialState, action) => {
  switch (action.type) {
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
    };

    default: return state;
  }
};

export default news;
