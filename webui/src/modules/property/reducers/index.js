import _ from 'lodash';

// selector
export const selectPropertyFromDomain = (domain, state) => {
  return _.get(state, `search.${domain}`);
};

const initialState = {
  entities: {},
  fetchStatus: {},
  errors: {},
  search: {
    home: {
      params: {},
      result: [],
      total: 0,
      loading: false,
    },
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {

    case 'PROPERTY/SEARCH/START': {
      return {
        ...state,
        search: _.assign({}, state.search, {
          [action.domain]: {
            ...state.search[action.domain],
            loading: true,
          },
        }),
      };
    }

    case 'PROPERTY/SEARCH/END': {
      return {
        ...state,
        search: _.assign({}, state.search, {
          [action.domain]: {
            ...state.search[action.domain],
            loading: false,
          },
        }),
      };
    }
    case 'PROPERTY/SEARCH_RESULT/RECEIVED': {
      return {
        ...state,
        search: _.assign({}, state.search, {
          [action.domain]: {
            params: action.searchParams,
            total: action.total,
            result: action.itemIds,
          },
        }),
      };
    }

    case 'PROPERTY/ENTITIES/RECEIVED': {
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

    case 'PROPERTY/ENTITY/RECEIVED': {
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

    case 'PROPERTY/SET_HILIGHT': {
      const propertyId = action.propertyId;
      return {
        ...state,
        entities: {
          ...state.entities,
          [propertyId]: {
            ..._.get(state, `entities.${propertyId}`),
            hilight: action.value,
          },
        },
      };
    }

    default: return state;
  }
};

export default reducer;
