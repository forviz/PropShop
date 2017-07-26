import _ from 'lodash';
import moment from 'moment';
import { getPropertyIDs, getProperties } from '../api';
import toURLParam from '../utils/toURLParam';


export const setHilightProperty = (propertyId, value = true) => {
  return {
    type: 'PROPERTY/SET_HILIGHT',
    propertyId,
    value,
  };
};

const propertySearchStart = (domain = 'default') => {
  return {
    type: 'PROPERTY/SEARCH/START',
    domain,
  };
};

const propertySearchEnd = (domain = 'default') => {
  return {
    type: 'PROPERTY/SEARCH/END',
    domain,
  };
};

export const receivePropertySearchResult = (itemIds, total, domain, searchParams) => {
  return {
    type: 'PROPERTY/SEARCH_RESULT/RECEIVED',
    total,
    itemIds,
    domain,
    searchParams,
  };
};

export const receivePropertiesEntity = (properties) => {
  return {
    type: 'PROPERTY/ENTITIES/RECEIVED',
    properties,
  };
};

export const search = (searchParams, domain = 'default') => {
  console.log('searchPropertiesAction', searchParams);
  return (dispatch, getState) => {
    dispatch(propertySearchStart(domain));

    // Get all properties, with ID Only
    return getPropertyIDs(searchParams)
    .then((result) => {
      dispatch(receivePropertySearchResult(result.itemIds, result.total, domain, searchParams));
      return result.itemIds;
    })
    .then((visibleIDs) => {
      const fetchedPropertyIDs = Object.keys(_.pickBy(_.get(getState(), 'entities.properties.fetchStatus'), val => val === 'loaded'));
      const propertyIDsToFetch = _.difference(visibleIDs, fetchedPropertyIDs);
      getProperties(`?ids=${_.join(propertyIDsToFetch, ',')}`)
      .then((properties) => {
        dispatch(receivePropertiesEntity(properties));
        dispatch(propertySearchEnd(domain));
      })
      .catch((e) => {
        console.log(e);
        dispatch(propertySearchEnd(domain));
      })
    });
  };
};

export const getLandingItems = () => {
  return (dispatch) => {

    const condoParams = toURLParam({
      propertyType: 'Condominium',
      limit: 5,
    });
    dispatch(search(condoParams, 'landing-condo'));

    const homeParams = toURLParam({
      propertyType: 'Home',
      limit: 5,
    });
    dispatch(search(homeParams, 'landing-home'));
  };
};
