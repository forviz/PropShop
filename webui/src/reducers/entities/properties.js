import _ from 'lodash';

const initialState = {
  entities: {},
  fetchStatus: {},
  errors: {},
};

const properties = (state = initialState, action) => {
  switch (action.type) {

    case 'ENTITY/PROPERTIES/RECEIVED': {
      return {
        ...state,
        entities: _.reduce(action.properties.data, (acc, property) => {
          return { ...acc, [property.id]: property };
        }, state.entities),
        fetchStatus: _.reduce(action.properties.data, (acc, property) => {
          return { ...acc, [property.id]: 'loaded' };
        }, state.fetchStatus),
      };
    }
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
