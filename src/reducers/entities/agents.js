const initialState = {
  entities: {},
  fetchStatus: {},
  errors: {},
};

const agents = (state = initialState, action) => {
  switch (action.type) {
    case 'ENTITY/AGENT/RECEIVED': {
      const agentId = action.agentId;
      return {
        ...state,
        entities: {
          ...state.entities,
          [agentId]: { ...state.entities[agentId], ...action.agent },
        },
        fetchStatus: {
          ...state.fetchStatus,
          [agentId]: 'loaded',
        },
      };
    }

    default: return state;
  }
};

export default agents;
