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
    const { id, query, propertyType, residentialType, bedroom, bathroom, priceMin, priceMax } = req.query;
    const _for = req.query.for;

    const propertyQuery = _.omitBy({
      content_type: 'property',
      'sys.id': id,
      query,
      'fields.forSale': _for === 'sale',
      'fields.forRent': _for === 'rent',
      'fields.propertyType': propertyType || residentialType,
      'fields.numBedrooms': bedroom ? _.toNumber(bedroom) : undefined,
      'fields.numBathrooms': bathroom ? _.toNumber(bathroom) : undefined,
      'fields.priceSale.value[gte]': _for === 'sale' ? priceMin : undefined,
      'fields.priceSale.value[lte]': _for === 'sale' ? priceMax : undefined,
      'fields.priceRent.value[gte]': _for === 'rent' ? priceMin : undefined,
      'fields.priceRent.value[lte]': _for === 'rent' ? priceMax : undefined,
    }, val => val === undefined || val === '' || val === false);
    const response = await client.getEntries(propertyQuery);
    res.json(response);
  } catch (e) {
    res.status(500).json({
      status: 'ERROR',
      message: e.message,
    });
  }
}
