const initialState = {
  entities: {},
  fetchStatus: {},
  errors: {},
};

const activities = (state = initialState, action) => {
  switch (action.type) {
    case 'ENTITY/ACTIVITY/RECEIVED': {
      const activityId = action.activityId;
      return {
        ...state,
        entities: {
          ...state.entities,
          [activityId]: { ...state.entities[activityId], ...action.activity },
        },
        fetchStatus: {
          ...state.fetchStatus,
          [activityId]: 'loaded',
        },
      };
    }

    default: return state;
  }
};

export default activities;
