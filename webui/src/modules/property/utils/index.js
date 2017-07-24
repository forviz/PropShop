import _ from 'lodash';
import queryString from 'query-string';

const PAGE_SIZE = 30;

const defaultParam = {
  for: 'sale',
  propertyType: ['condominium'],
};

const getAreaParamFromSlug = (areaSlug, areaEntities) => {
  const [areaName, boundStr] = _.split(areaSlug, '@');
  let areaBound;

  if (boundStr && _.size(_.split(boundStr, ',')) === 4) {
    const [swLat, swLng, neLat, neLng] = _.map(_.split(boundStr, ','), pos => _.toNumber(pos));
    areaBound = {
      ne: { lat: neLat, lng: neLng },
      sw: { lat: swLat, lng: swLng },
    };
  }

  if (areaName && _.isEmpty(boundStr)) {
    // Find bound from areaEntities
    areaBound = _.get(areaEntities, `${areaSlug}.bound`);
  }

  return {
    name: areaName,
    bound: areaBound,
  };
};

const isValidBound = (bound) => {
  if (!bound) return false;
  if (!bound.sw || !bound.ne) return false;
  if (
    !_.isNumber(_.get(bound, 'sw.lat')) ||
    !_.isNumber(_.get(bound, 'sw.lng')) ||
    !_.isNumber(_.get(bound, 'ne.lat')) ||
    !_.isNumber(_.get(bound, 'ne.lng'))) return false;
  return true;
};

export const getBoundSlug = (bound) => {
  if (!isValidBound(bound)) return '';
  return `${_.get(bound, 'sw.lat')},${_.get(bound, 'sw.lng')},${_.get(bound, 'ne.lat')},${_.get(bound, 'ne.lng')}`;
};

export const getAreaSlugFromParam = (areaParams) => {
  return `${_.get(areaParams, 'name', '')}${isValidBound(areaParams.bound) ? `@${getBoundSlug(areaParams.bound)}` : ''}`;
};


export const convertRouterPropsToParams = (props, areaEntities) => {
  const search = queryString.parse(_.get(props, 'location.search', {}));
  // console.log('convertRouterPropsToParams', search);
  const area = _.get(props, 'match.params.area');
  return {
    area: getAreaParamFromSlug(area, areaEntities),
    for: _.replace(_.get(props, 'match.params.for'), 'for-', '') || defaultParam.for,
    // propertyType: _.split(_.get(props, 'match.params.propertyType'), ',') || defaultParam.propertyType,
    propertyType: !_.isEmpty(_.get(props, 'match.params.propertyType')) ?
      _.split(_.get(props, 'match.params.propertyType'), ',')
      :
      defaultParam.propertyType,
    // Query Parameters
    bedroom: _.get(search, 'bedroom') ? _.toNumber(_.get(search, 'bedroom')) : undefined,
    bathroom: _.get(search, 'bathroom') ? _.toNumber(_.get(search, 'bathroom')) : undefined,
    price: _.get(search, 'price') ? {
      min: _.toNumber(_.head(_.split(_.get(search, 'price'), '-'))),
      max: _.toNumber(_.last(_.split(_.get(search, 'price'), '-'))),
    } : { min: undefined, max: undefined },
  };
};


export const convertParamsToLocationObject = (params) => {
  const areaSlug = getAreaSlugFromParam(params.area);
  return {
    pathname: `/${params.propertyType}/for-${params.for}/${areaSlug}/`,
    search: `?${queryString.stringify({
      bedroom: _.get(params, 'bedroom'),
      bathroom: _.get(params, 'bathroom'),
      price: (_.get(params, 'price.min') || _.get(params, 'price.max')) ?
        `${_.get(params, 'price.min', '0')}-${_.get(params, 'price.max', '')}`
        :
        undefined,
      skip: _.get(params, 'skip', 0),
    })}`,
  };
};

const convertToURLParam = data => `?${_.join(_.map(_.omitBy(data, val => val === undefined), (value, key) => `${key}=${value}`), '&')}`;

export const convertParamsToSearchAPI = (params) => {
  console.log('convertParamsToSearchAPI', params);
  return convertToURLParam({
    // id: undefined,
    // ids: undefined,
    // query,
    for: params.for,
    propertyType: _.join(_.get(params, 'propertyType'), ','),
    bedroom: _.get(params, 'bedroom') ? _.toNumber(_.get(params, 'bedroom')) : undefined,
    bathroom: _.get(params, 'bathroom') ? _.toNumber(_.get(params, 'bathroom')) : undefined,
    priceMin: _.get(params, 'price.min') ? _.toNumber(_.get(params, 'price.min')) : undefined,
    priceMax: _.get(params, 'price.max') ? _.toNumber(_.get(params, 'price.max')) : undefined,
    bound: _.get(params, 'area.bound') ? getBoundSlug(_.get(params, 'area.bound')) : undefined,
    skip: _.get(params, 'skip', 0),
    limit: _.get(params, 'limit', PAGE_SIZE),
    // select
  });
};
