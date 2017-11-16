// import * as contentful from 'contentful';
// import * as contentfulManagement from 'contentful-management';
import _ from 'lodash';

import { createPropertyApi, deleteAll, deleteAll2, getPropertiesByVendor, deletePropertyApi, getPropertiesById } from './property';

import * as helpers from '../helpers';

// const client = contentful.createClient({
//   space: process.env.CONTENTFUL_SPACE,
//   accessToken: process.env.CONTENTFUL_ACCESSTOKEN,
// });

// const clientManagement = contentfulManagement.createClient({
//   accessToken: process.env.CONTENTFUL_ACCESSTOKEN_MANAGEMENT,
// });

// const API_URL = 'http://feed.bkkcitismart.com/generate/propshop';

const fetch = require('node-fetch');
const parser = require('xml2json');


const vendorList = () => {
  const list = ['ap'];
  return list;
};

const vendorFunction = {};
vendorFunction.getVendorAp = async (vendor, updateImage = 'false', id = '') => {
  const msg = {
    status: 'success',
    message: '',
    pageTotal: 0,
    itemTotal: 0,
    successTotal: 0,
    propertiesErrorsId: [],
    myErrors: [],
    contentfulErrors: [],
  };

  for (let page = 1; page < 10; page += 1) {
    const xml = await fetch(`http://feed.bkkcitismart.com/generate/propshop?page=${_.toString(page)}`).then(response => response.text());

    if (!xml) {
      if (page === 1) {
        msg.message = 'Empty data.';
      }
      break;
    }

    const dataParser = parser.toJson(xml, {
      object: true,
    });

    let properties = dataParser.document.Clients.Client.properties.Property;

    if (id) {
      properties = _.filter(properties, (property) => {
        return property.propertyid === id;
      });
    }

    const newItemIds = [];
    const oldItemIds = await getPropertiesByVendor(vendor);

    for (let i = 0; i < _.size(properties); i += 1) {
      console.log('starting import', i);
      const property = properties[i];
      const referenceKey = property.propertyid;

      newItemIds.push(referenceKey);

      let propertyType = property.Description.propertyType;
      if (propertyType === 'Townhouse') {
        propertyType = 'town-home';
      }

      let _for = property.Price.status;
      if (_for === 'For Sale') {
        _for = 'sale';
      } else if (_for === 'For Rent') {
        _for = 'rent';
      } else {
        _for = '';
      }

      if (!_for) {
        msg.propertiesErrorsId.push(referenceKey);
        msg.myErrors.push({
          id: referenceKey,
          message: 'unknown "for" data',
          data: 'property.Price.status',
        });
      } else {
        const mapFieldsData = {
          propertyType,
          nameEn: property.Description.title.title_en,
          nameTh: property.Description.title.title_th,
          descriptionEn: property.Project.project_description.desc_en,
          descriptionTh: property.Project.project_description.desc_th,
          fullAddressEn: property.Address.location.location_en,
          fullAddressTh: property.Address.location.location_th,
          for: _for,
          price: property.Price.price,
          currency: property.Price.currency,
          bedroom: property.Description.bedrooms,
          bathroom: property.Description.fullBathrooms,
          location: {
            lat: property.Project.project_latitude,
            lng: property.Project.project_longitude,
          },
          project_en: property.Project.project_en,
          project_th: property.Project.project_th,
          areaSize: property.Description.FloorSize.floorSize,
          areaSizeUnits: property.Description.FloorSize.floorSizeUnits,
          coverImage: _.get(property.images, 'image[0].image.$t') || _.get(property.images, 'image.image.$t'),
          images: _.get(property.images, 'image[0].image.$t') ? _.map(property.images.image, (image, index) => {
            if (index > 0) {
              return image.image.$t;
            }
          }) : [],
          tags: _.map(property.Facilities.feature, (feature) => {
            return feature.featureName;
          }),
          referenceName: vendor,
          referenceKey,
          userId: 'SnPBqoICmOUOgMi4ikISq',
        };
        const created = await createPropertyApi(mapFieldsData, updateImage);
        helpers.logs('api.json', created);
        if (_.get(created, 'sys.id')) {
          console.log('import property success', msg.successTotal);
          msg.successTotal += 1;
        } else {
          msg.propertiesErrorsId.push(referenceKey);
          msg.contentfulErrors.push(created);
          console.log('import property fail', created);
        }
      }
      msg.itemTotal += 1;
    }

    for (let k = 0; k < _.size(oldItemIds); k += 1) {
      const oldItemId = oldItemIds[k];
      if (!_.includes(newItemIds, oldItemId)) {
        await deletePropertyApi(oldItemId);
      }
    }

    msg.pageTotal += 1;
  }
  return msg;
};

export const process = async (req, res) => {
  const { vendor } = req.params;
  if (!_.includes(vendorList(), vendor)) {
    return res.json({
      status: 'fail',
      error: 'no vendor',
    });
  }

  const { updateImage } = req.query;

  const funcstr = `getVendor${helpers.capitalizeFirstLetter(vendor)}`;
  const result = await vendorFunction[funcstr](vendor, updateImage);
  helpers.logs('summary.json', result);
  return res.json(result);
};

export const process2 = async (req, res) => {
  const { vendor, id } = req.params;
  if (!_.includes(vendorList(), vendor)) {
    return res.json({
      status: 'fail',
      error: 'no vendor',
    });
  }

  const property = await getPropertiesById(id);
  const referenceKey = _.get(property, 'items.0.fields.referenceKey');

  const funcstr = `getVendor${helpers.capitalizeFirstLetter(vendor)}`;
  const result = await vendorFunction[funcstr](vendor, 'true', referenceKey);
  helpers.logs('summary.json', result);
  return res.json(result);
};

export const process3 = async (req, res) => {
  const result = await deleteAll2();
  return res.json(result);
};
