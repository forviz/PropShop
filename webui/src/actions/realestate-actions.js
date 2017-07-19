import _ from 'lodash';
import { getProperties, getPropertyIDs } from '../api/property';
import { handleError } from './errors';

export const realestateFilter = (filter) => {
  return {
    type: 'REALESTATE/FILTER',
    filter,
  };
};

export const realestateLoading = (loading) => {
  return {
    type: 'REALESTATE/LOADING',
    loading,
  };
};

export const realestateServiceReturnWithSuccess = (result) => {
  return {
    type: 'REALESTATE/RECEIVED/SUCCESS',
    items: result,
  };
};

export const receivePropertiesEntity = (properties) => {
  return {
    type: 'ENTITY/PROPERTIES/RECEIVED',
    properties,
  }
};

// export const propertyServiceReturnWithSuccess = (result) => {
//   console.log('propertyServiceReturnWithSuccess', result);
//   return {
//     // type: 'PROPERTY/RECEIVED/SUCCESS',
//     type: 'ENTITY/PROPERTY/RECEIVED'
//     items: result,
//   };
// };

export const receivePropertySearchResult = (itemIds, total) => {
  return {
    type: 'DOMAIN/PROPERTY_SEARCH/RESULT_RECEIVED',
    total,
    itemIds,
  };
}

export const searchProperties = (search) => {
  console.log('searchProperties', search);
  return (dispatch, getState) => {
    dispatch(realestateLoading(true));

    // Get all properties, with ID Only
    getPropertyIDs(search)
    .then((result) => {
      dispatch(receivePropertySearchResult(result.itemIds, result.total));
      return result.itemIds;
    })
    .then((visibleIDs) => {
      const fetchedPropertyIDs = Object.keys(_.pickBy(_.get(getState(), 'entities.properties.fetchStatus'), val => val === 'loaded'));
      const propertyIDsToFetch = _.difference(visibleIDs, fetchedPropertyIDs);
      getProperties(`?ids=${_.join(propertyIDsToFetch, ',')}`)
      .then((properties) => {
        console.log('receivePropertiesEntity', properties);
        dispatch(receivePropertiesEntity(properties));
        dispatch(realestateLoading(false));
      });
    })
    .catch((error) => {
      dispatch(handleError(error));
    });
  };
};
