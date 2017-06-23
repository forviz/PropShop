const initialState = {
  entities: {},
  fetchStatus: {},
  errors: {},
};

const properties = (state = initialState, action) => {
  switch (action.type) {
    case 'ENTITY/PROPERTY/RECEIVED': {
      const propertyId = action.propertyId;
      return {
        ...state,
        entities: {
          ...state.entities,
          [propertyId]: { ...state.entities[propertyId], ...action.property },
        },
        fetchStatus: {
          ...state.fetchStatus,
          [propertyId]: 'loaded',
        },
      };
    }


    default: return state;
  }
};

export default properties;
