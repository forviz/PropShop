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

    case 'ENTITY/AGENT/REFERENCES/RECEIVED': {
      const agentId = action.agentId;
      return {
        ...state,
        entities: {
          ...state.entities,
          [agentId]: {
            ...state.entities[agentId],
            references: action.ids,
          },
        },
      };
    }

    case 'ENTITY/AGENT/PROPERTIES/RECEIVED': {
      const agentId = action.agentId;
      return {
        ...state,
        entities: {
          ...state.entities,
          [agentId]: {
            ...state.entities[agentId],
            properties: action.ids,
          },
        },
      };
    }

    case 'ENTITY/AGENT/ACTIVITIES/RECEIVED': {
      const agentId = action.agentId;
      return {
        ...state,
        entities: {
          ...state.entities,
          [agentId]: {
            ...state.entities[agentId],
            activities: action.ids,
          },
        },
      };
    }

    default: return state;
  }
};

export default agents;
