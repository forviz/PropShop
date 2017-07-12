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

    case 'PROPERTY/RECEIVED/SUCCESS': {
      return {
        ...state,
        data: { ...state.data, ...action.items },
      };
    }
    // case 'REALESTATE/RECEIVED/SUCCESS': {
    //   return {
    //     ...state,
    //     entities: _.reduce(entitie, (acc, elem) => {
    //       return {
    //         ...acc,
    //         [elem.sys.id]: elem.fields,
    //       }
    //     }, state.entities),
    //     display: _.map(display, elem => elem.sys.id),
    //   };

    // }
    default:
      return state;
  }
}

export default reducers;
