import * as contentful from 'contentful';
import * as contentfulManagement from 'contentful-management';
import _ from 'lodash';
import moment from 'moment';

const BASEURL = 'http://localhost:4000/api/v1';

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_ACCESSTOKEN,
});

const clientManagement = contentfulManagement.createClient({
  accessToken: process.env.CONTENTFUL_ACCESSTOKEN_MANAGEMENT,
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

export const create = async (req, res, next) => {
  try {
    const { data, userId } = req.body;

    let images = [];
    if (_.get(data, 'imagesId')) {
      images = _.map(_.get(data, 'imagesId'), (id) => {
        return {
          sys: {
            id,
            linkType: 'Asset',
            type: 'Link',
          }
        };
      });
    }

    let tags = [];
    if (_.get(data, 'step1.specialFeatureFacilities') || 
      _.get(data, 'step1.specialFeatureNearbyPlaces') || 
      _.get(data, 'step1.specialFeaturePrivate') || 
      _.get(data, 'step1.specialFeatureView')) {
        tags = _.concat(_.get(data, 'step1.specialFeatureFacilities'), _.get(data, 'step1.specialFeatureNearbyPlaces'), _.get(data, 'step1.specialFeaturePrivate'), _.get(data, 'step1.specialFeatureView'));
    }

    const response = await clientManagement.getSpace(process.env.CONTENTFUL_SPACE)
    .then((space) => space.createEntry('property', {
      fields: {
        propertyType: {
          'en-US': _.get(data, 'step0.residentialType'),
        },
        nameTh: {
          'en-US': _.get(data, 'step0.topic'),
        },
        description: {
          'en-US': {
            en: '',
            th: _.get(data, 'step0.announcementDetails'),
          },
        },
        location: {
          'en-US': {
            "soi": "",
            "full": {
              "en": "",
              "th": ""
            },
            "areas": [],
            "mooNo": "",
            "street": _.get(data, 'step0.street'),
            "unitNo": _.get(data, 'step0.address'),
            "floorNo": "",
            "summary": {
              "en": "",
              "th": ""
            },
            "zipcode": _.get(data, 'step0.zipcode'),
            "district": _.get(data, 'step0.district'),
            "latitude": _.get(data, 'step0.googleMap.markers[0].position.lat'),
            "province": _.get(data, 'step0.province'),
            "longitude": _.get(data, 'step0.googleMap.markers[0].position.lng'),
            "buildingNo": "",
            "subDistrict": _.get(data, 'step0.amphur'),
            "publicTransports": [
              {
                "name": "0",
                "type": "BTS",
                "distance": 0
              },
              {
                "name": "0",
                "type": "MRT",
                "distance": 0
              },
              {
                "name": "0",
                "type": "BRT",
                "distance": 0
              }
            ]
          },
        },
        attributes: {
          'en-US': {
            numFloors: "",
            yearBuilt: "",
            numBedrooms: _.get(data, 'step0.bedroom'),
            numBathrooms: _.get(data, 'step0.bathroom'),
          }
        },
        areaLand: {
          'en-US': {
            "unit": "sqm",
            "value": "",
            "width": "",
            "detail": "",
            "height": ""
          },
        },
        forSale: {
          'en-US': _.get(data, 'step0.for') === 'ขาย' ? true : false,
        },
        forRent: {
          'en-US': _.get(data, 'step0.for') === 'เช่า' ? true : false,
        },
        priceSale: {
          'en-US': {
            "type": "",
            "until": "",
            "value": _.get(data, 'step0.for') === 'ขาย' ? _.get(data, 'step0.price') : '',
            "detail": "",
            "currency": "thb",
            "discount": 0
          },
        },
        priceRent: {
          'en-US': {
            "type": "",
            "until": "",
            "value": _.get(data, 'step0.for') === 'เช่า' ? _.get(data, 'step0.price') : '',
            "detail": "",
            "currency": "thb",
            "discount": 0
          },
        },
        coverImage: {
          'en-US': {
            sys: {
              id: _.get(data, 'coverImageId'),
              linkType: 'Asset',
              type: 'Link',
            }
          },
        },
        images: {
          'en-US': images,
        },
        tags: {
          'en-US': tags,
        },
        numBedrooms: {
          'en-US': _.toNumber(_.get(data, 'step0.bedroom')),
        },
        numBathrooms: {
          'en-US': _.toNumber(_.get(data, 'step0.bathroom')),
        },
        locationMarker: {
          'en-US': {
            lon: _.get(data, 'step0.googleMap.markers[0].position.lng'),
            lat: _.get(data, 'step0.googleMap.markers[0].position.lat'),
          }
        },
        priceSaleValue: {
          'en-US': _.get(data, 'step0.for') === 'ขาย' ? _.toNumber(_.get(data, 'step0.price')) : 0,
        },
        priceRentValue: {
          'en-US': _.get(data, 'step0.for') === 'เช่า' ? _.toNumber(_.get(data, 'step0.price')) : 0,
        },
        province: {
          'en-US': _.get(data, 'step0.province'),
        },
        projectName: {
          'en-US': _.get(data, 'step0.project'),
        },
        areaSize: {
          'en-US': _.toNumber(_.get(data, 'step0.areaSize')),
        },
        agent: {
          'en-US': {
            sys: {
              type: "Link",
              linkType: "Entry",
              id: userId,
            }
          }
        }
      }
    }))
    .then((entry) => {
      return entry;
    });

    res.json({
      data: response,
    });
  } catch (e) {
    res.status(500).json({
      status: '500',
      code: 'Internal Server Error',
      title: e.message,
    });
  }
}
