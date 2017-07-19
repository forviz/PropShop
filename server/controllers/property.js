import * as contentful from 'contentful';
import * as contentfulManagement from 'contentful-management';
import _ from 'lodash';
import moment from 'moment';

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_ACCESSTOKEN,
});

const contentfulDateFormat = 'YYYY-MM-DDTHH:mm:s.SSSZ'; //2015-05-18T11:29:46.809Z

export const queryProperties = async (req, res, next) => {
  try {
    console.log('req.query', req.query);
    const { id, ids, query, propertyType, residentialType, bedroom, bathroom, priceMin, priceMax, bound, location, select, agentId, limit, skip } = req.query;
    const _for = req.query.for;

    const propertyQuery = _.omitBy({
      content_type: 'property',
      'sys.id': id,
      'sys.id[in]': ids,
      query,
      'fields.forSale': _for === 'sale' || _for === 'ขาย',
      'fields.forRent': _for === 'rent' || _for === 'เช่า',
      'fields.propertyType[match]': propertyType || residentialType,
      'fields.numBedrooms[gte]': bedroom ? _.toNumber(bedroom) : undefined,
      'fields.numBathrooms[gte]': bathroom ? _.toNumber(bathroom) : undefined,
      'fields.priceSaleValue[gte]': _for === 'sale' && priceMin ? _.toNumber(priceMin) : undefined,
      'fields.priceSaleValue[lte]': _for === 'sale' && priceMax ? _.toNumber(priceMax) : undefined,
      'fields.priceRentValue[gte]': _for === 'rent' && priceMin ? _.toNumber(priceMin) : undefined,
      'fields.priceRentValue[lte]': _for === 'rent' && priceMax ? _.toNumber(priceMax) : undefined,
      'fields.locationMarker[within]': bound || location,
      'fields.agent.sys.id': agentId,
      select: select ? select : undefined,
      limit: limit ? limit : undefined,
      skip: skip ? skip : undefined,
    }, val => val === undefined || val === '' || val === false);
    console.log('propertyQuery', propertyQuery);
    const response = await client.getEntries(propertyQuery);
    res.json({ ...response, query: propertyQuery });
  } catch (e) {
    res.status(500).json({
      status: 'ERROR',
      message: e.message,
    });
  }
}

export const getEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await client.getEntry(id);
    res.json(response);
  } catch (e) {
    res.status(500).json({
      status: 'ERROR',
      message: e.message,
    });
  }
}
