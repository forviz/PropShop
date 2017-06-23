const initialState = {
  entities: {},
  fetchStatus: {},
  errors: {},
};

const references = (state = initialState, action) => {
  switch (action.type) {
    case 'ENTITY/REFERENCE/RECEIVED': {
      const referenceId = action.referenceId;
      return {
        ...state,
        entities: {
          ...state.entities,
          [referenceId]: { ...state.entities[referenceId], ...action.reference },
        },
        fetchStatus: {
          ...state.fetchStatus,
          [referenceId]: 'loaded',
        },
      };
    }

    default: return state;
  }
};

export default references;
