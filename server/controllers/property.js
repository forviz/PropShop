import * as contentful from 'contentful';
import * as contentfulManagement from 'contentful-management';
import _ from 'lodash';

import * as helpers from '../helpers';
import Property from '../models/Property';

const path = require('path');
const fs = require('fs');

const Mail = require('../libraries/email');

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_ACCESSTOKEN,
});

const clientManagement = contentfulManagement.createClient({
  accessToken: process.env.CONTENTFUL_ACCESSTOKEN_MANAGEMENT,
});

const BASE_URL = process.env.BASE_URL;

// const save = (req, res) => {
//   const property = new Property({
//     for: 'rent',
//   });
//   console.log('property', property);
//   property.save();
// };

const get = (req, res) => {
  const property = new Property({
    for: 'sale',
  });
  property.properties((err, data) => {
    console.log('get', err, data); // woof
  });
};

// save();
get();

// const contentfulDateFormat = 'YYYY-MM-DDTHH:mm:s.SSSZ'; //2015-05-18T11:29:46.809Z

export const queryProperties = async (req, res, next) => {
  try {
    console.log('req.query', req.query);
    const { id, ids, query, propertyType, residentialType, bedroom, bathroom, priceMin, priceMax, bound, select, agentId,
      limit, skip, enable, approve, order, realTime, notId } = req.query;
    const _for = req.query.for;
    const propertyQuery = _.omitBy({
      content_type: 'property',
      'sys.id': id,
      'sys.id[in]': ids,
      'sys.id[ne]': notId,
      query,
      'fields.forSale': _for === 'sale' || _for === 'ขาย',
      'fields.forRent': _for === 'rent' || _for === 'เช่า',
      'fields.propertyType[match]': _.lowerCase(propertyType),
      'fields.numBedrooms[gte]': bedroom ? _.toNumber(bedroom) : undefined,
      'fields.numBathrooms[gte]': bathroom ? _.toNumber(bathroom) : undefined,
      'fields.priceSaleValue[gte]': _for === 'sale' && priceMin ? _.toNumber(priceMin) : undefined,
      'fields.priceSaleValue[lte]': _for === 'sale' && priceMax ? _.toNumber(priceMax) : undefined,
      'fields.priceRentValue[gte]': _for === 'rent' && priceMin ? _.toNumber(priceMin) : undefined,
      'fields.priceRentValue[lte]': _for === 'rent' && priceMax ? _.toNumber(priceMax) : undefined,
      'fields.locationMarker[within]': bound ? bound : undefined,
      'fields.agent.sys.id': agentId ? agentId : undefined,
      // 'fields.enable': enable ? enable : undefined,
      // 'fields.approve': approve ? approve : undefined,
      select: select ? select : undefined,
      order: order ? order : undefined,
      limit: limit ? limit : undefined,
      skip: skip ? skip : undefined,
    }, val => val === undefined || val === '' || val === false);
    console.log('propertyQuery', propertyQuery);
    let response = {};
    if (realTime === '1') {
      response = await clientManagement.getSpace(process.env.CONTENTFUL_SPACE)
      .then(space => space.getEntries(propertyQuery));
    } else {
      response = await client.getEntries(propertyQuery);
    }
    res.json({ ...response, query: propertyQuery, realTime });
  } catch (e) {
    res.status(500).json({
      status: 'ERROR',
      message: e.message,
    });
  }
};

export const create = async (req, res, next) => {
  try {
    const { data, userId, userEmail, userName } = req.body;

    let images = [];
    if (_.get(data, 'imagesId')) {
      images = _.map(_.get(data, 'imagesId'), (id) => {
        return {
          sys: {
            id,
            linkType: 'Asset',
            type: 'Link',
          },
        };
      });
    }

    let tags = [];
    if (_.get(data, 'step1.specialFeatureFacilities') ||
      _.get(data, 'step1.specialFeatureNearbyPlaces') ||
      _.get(data, 'step1.specialFeaturePrivate') ||
      _.get(data, 'step1.specialFeatureView')) {
      tags = _.concat(_.get(data, 'step1.specialFeatureFacilities'),
      _.get(data, 'step1.specialFeatureNearbyPlaces'),
      _.get(data, 'step1.specialFeaturePrivate'),
      _.get(data, 'step1.specialFeatureView'));
    }

    const fieldsData = {
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
              "th": _.get(data, 'step0.address'),
            },
            "areas": [],
            "mooNo": "",
            "street": _.get(data, 'step0.street'),
            "unitNo": '',
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
            "discount": 0,
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
            lon: _.get(data, 'step0.googleMap.markers.position.lng'),
            lat: _.get(data, 'step0.googleMap.markers.position.lat'),
          },
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
              type: 'Link',
              linkType: 'Entry',
              id: userId,
            },
          },
        },
        enable: {
          'en-US': false,
        },
        approve: {
          'en-US': false,
        },
      },
    };

    if (_.get(data, 'coverImageId')) {
      const coverImage = {
        'en-US': {
          sys: {
            id: _.get(data, 'coverImageId'),
            linkType: 'Asset',
            type: 'Link',
          },
        },
      };
      _.set(fieldsData.fields, 'coverImage', coverImage);
    }

    const response = await clientManagement.getSpace(process.env.CONTENTFUL_SPACE)
    .then(space => space.createEntry('property', fieldsData))
    .then((entry) => {
      return entry.publish();
    });

    const propertyId = _.get(response, 'sys.id');
    if (!propertyId) {
      res.status(500).json({
        status: '500',
        code: 'Internal Server Error',
      });
      process.exit();
    }

    fs.readFile(path.join(__dirname, '../views/email/template/create-property', 'index.html'), 'utf8', (err, html) => {
      if (err) {
        throw err;
      }

      let htmlx = html;
      htmlx = htmlx.replace(/\%BASE_URL%/g, BASE_URL);
      htmlx = htmlx.replace('%NAME%', userName);
      htmlx = htmlx.replace('%PROPERTY_ID%', propertyId);
      htmlx = htmlx.replace('%PROPERTY_URL%', `${BASE_URL}/#/property/${propertyId}?preview=true`);

      const mail = new Mail({
        to: userEmail,
        subject: 'Your property has been uploaded',
        html: htmlx,
        successCallback: (suc) => {
        },
        errorCallback: (err) => {
        },
      });
      mail.send();
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
};

export const update = async (req, res, next) => {
  try {
    const data = req.body;
    const { id } = req.params;

    const response = await clientManagement.getSpace(process.env.CONTENTFUL_SPACE)
    .then((space) => space.getEntry(id))
    .then((entry) => {
      if (_.get(data, 'step0.residentialType')) _.set(entry.fields, "propertyType['en-US']", data.step0.residentialType);
      if (_.get(data, 'step0.topic')) _.set(entry.fields, "nameTh['en-US']", data.step0.topic);
      if (_.get(data, 'step0.announcementDetails')) {
        _.set(entry.fields, "description['en-US']", {
          "en": "",
          "th": data.step0.announcementDetails,
        });
      }
      _.set(entry.fields, "location['en-US']", {
        "soi": "",
        "full": {
          "en": "",
          "th": _.get(data, 'step0.address'),
        },
        "areas": [],
        "mooNo": "",
        "street": _.get(data, 'step0.street'),
        "unitNo": '',
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
      });
      _.set(entry.fields, "attributes['en-US']", {
        "numFloors": "",
        "yearBuilt": "",
        "numBedrooms": _.get(data, 'step0.bedroom'),
        "numBathrooms": _.get(data, 'step0.bathroom'),
      });
      _.set(entry.fields, "areaLand['en-US']", {
        "unit": "sqm",
        "value": _.get(data, 'step0.areaSize'),
        "width": "",
        "detail": "",
        "height": ""
      });
      if (_.get(data, 'step0.for')) _.set(entry.fields, "forSale['en-US']", _.get(data, 'step0.for') === 'ขาย' ? true : false);
      if (_.get(data, 'step0.for')) _.set(entry.fields, "forRent['en-US']", _.get(data, 'step0.for') === 'เช่า' ? true : false);
      if (_.get(data, 'step0.for') === 'ขาย') {
        _.set(entry.fields, "priceSale['en-US']", {
          "type": "",
          "until": "",
          "value": _.get(data, 'step0.price'),
          "detail": "",
          "currency": "thb",
          "discount": 0
        });
      }
      if (_.get(data, 'step0.for') === 'เช่า') {
        _.set(entry.fields, "priceRent['en-US']", {
          "type": "",
          "until": "",
          "value": _.get(data, 'step0.price'),
          "detail": "",
          "currency": "thb",
          "discount": 0
        });
      }
      if (_.get(data, 'coverImageId')) {
        _.set(entry.fields, "coverImage['en-US'].sys.id", _.get(data, 'coverImageId'));
        _.set(entry.fields, "coverImage['en-US'].sys.linkType", 'Asset');
        _.set(entry.fields, "coverImage['en-US'].sys.type", 'Link');
      }
      if (_.get(data, 'imagesId')) {
        const images = _.map(_.get(data, 'imagesId'), (id) => {
          return {
            sys: {
              id,
              linkType: 'Asset',
              type: 'Link',
            }
          };
        });
        _.set(entry.fields, "images['en-US']", images);
      }
      if (_.get(data, 'step1.specialFeatureFacilities') || 
        _.get(data, 'step1.specialFeatureNearbyPlaces') || 
        _.get(data, 'step1.specialFeaturePrivate') || 
        _.get(data, 'step1.specialFeatureView')) {
          const tags = _.concat(_.get(data, 'step1.specialFeatureFacilities'), _.get(data, 'step1.specialFeatureNearbyPlaces'), _.get(data, 'step1.specialFeaturePrivate'), _.get(data, 'step1.specialFeatureView'));
          _.set(entry.fields, "tags['en-US']", tags);
      }
      if (_.get(data, 'step0.bedroom')) _.set(entry.fields, "numBedrooms['en-US']", _.toNumber(data.step0.bedroom));
      if (_.get(data, 'step0.bathroom')) _.set(entry.fields, "numBathrooms['en-US']", _.toNumber(data.step0.bathroom));
      if (_.get(data, 'step0.googleMap.markers[0].position.lng') && _.get(data, 'step0.googleMap.markers[0].position.lat')) {
        _.set(entry.fields, "locationMarker['en-US']", {
          lon: _.get(data, 'step0.googleMap.markers[0].position.lng'),
          lat: _.get(data, 'step0.googleMap.markers[0].position.lat'),
        });
      }
      if (_.get(data, 'step0.price')) _.set(entry.fields, "priceSaleValue['en-US']", _.get(data, 'step0.for') === 'ขาย' ? _.toNumber(_.get(data, 'step0.price')) : 0);
      if (_.get(data, 'step0.price')) _.set(entry.fields, "priceRentValue['en-US']", _.get(data, 'step0.for') === 'เช่า' ? _.toNumber(_.get(data, 'step0.price')) : 0);
      if (_.get(data, 'step0.province')) _.set(entry.fields, "province['en-US']", data.step0.province);
      if (_.get(data, 'step0.project')) _.set(entry.fields, "projectName['en-US']", data.step0.project);
      if (_.get(data, 'step0.areaSize')) _.set(entry.fields, "areaSize['en-US']", _.toNumber(data.step0.areaSize));
      if (_.get(data, 'enable') === true || _.get(data, 'enable') === false) {
        _.set(entry.fields, "enable['en-US']", data.enable);
      }
      if (_.get(data, 'approve') === true || _.get(data, 'approve') === false) {
        _.set(entry.fields, "approve['en-US']", data.approve);
      }

      return entry.update();
    })
    .then((entry) => {
      return entry.publish();
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

export const deleteProperty = async (req, res, next) => {
  try {
    const { id } = req.params;

    const response = clientManagement.getSpace(process.env.CONTENTFUL_SPACE)
    .then((space) => space.getEntry(id))
    .then((entry) => entry.unpublish())
    .then((entry) => entry.delete())
    
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
};

export const addImage = async (req, res, next) => {
  try {
    const { imageId } = req.body;
    const { id } = req.params;

    const response = await clientManagement.getSpace(process.env.CONTENTFUL_SPACE)
    .then((space) => space.getEntry(id))
    .then((entry) => {
      _.set(entry.fields, "coverImage['en-US'].sys.id", 'imageId');
      _.set(entry.fields, "coverImage['en-US'].sys.linkType", 'Asset');
      _.set(entry.fields, "coverImage['en-US'].sys.type", 'Link');
      return entry.update();
    })
    .then((entry) => {
      return entry.publish();
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

export const addImages = async (req, res, next) => {
  try {
    const { imagesId } = req.body;
    const { id } = req.params;

    const response = await clientManagement.getSpace(process.env.CONTENTFUL_SPACE)
    .then((space) => space.getEntry(id))
    .then((entry) => {
      const images = _.map(imagesId, (id) => {
        return {
          sys: {
            id,
            linkType: 'Asset',
            type: 'Link',
          }
        };
      });
      _.set(entry.fields, "images['en-US']", images);
      return entry.update();
    })
    .then((entry) => {
      return entry.publish();
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

export const shareProperty = async (req, res, next) => {
  try {
    const { name, email, sendTo, project, propertyUrl } = req.body;

    fs.readFile(path.join(__dirname, '../views/email/template/share-property', 'index.html'), 'utf8', (err, html) => {
      if (err) {
        throw err;
      }

      let htmlx = html;
      htmlx = htmlx.replace(/\%BASE_URL%/g, BASE_URL);
      htmlx = htmlx.replace('%NAME%', name);
      htmlx = htmlx.replace('%PROJECT%', project);
      htmlx = htmlx.replace(/\%PROPERTY_URL%/g, propertyUrl);

      const mail = new Mail({
        to: sendTo,
        subject: `${name} wants you to see this property`,
        html: htmlx,
        replyTo: email,
        successCallback: (suc) => {
          res.json({
            status: 'success',
          });
        },
        errorCallback: (err) => {
          res.json({
            status: 'fail',
          });
        },
      });
      mail.send();
    });
  } catch (e) {
    res.status(500).json({
      status: '500',
      code: 'Internal Server Error',
      title: e.message,
    });
  }
};

const uploadImage = async (url) => {
  if (!url) {
    return false;
  }

  console.log('starting import image...');

  const contentType = await helpers.getImageType(url);
  const imageName = helpers.getImageName(url);

  const result = await clientManagement.getSpace(process.env.CONTENTFUL_SPACE)
  .then((space) => space.createAsset({
    fields: {
      title: {
        'en-US': imageName,
      },
      file: {
        'en-US': {
          contentType,
          fileName: imageName,
          upload: url,
        }
      }
    }
  }))
  .then(asset => asset.processForAllLocales())
  .then(asset => asset.publish())
  .catch(error => error);

  const logMsg = _.get(result, 'sys.id') ? 'success' : 'fail';
  console.log(logMsg);

  return result;
}

const deleteImage = async (id) => {
  if (!id) {
    return false;
  }
  return clientManagement.getSpace(process.env.CONTENTFUL_SPACE)
  .then(space => space.getAsset(id))
  .then(asset => asset.unpublish())
  .then(asset => asset.delete())
  .then(() => console.log('Old Asset deleted.'))
  .catch(console.error);
};

const vendorHasProperty = async (referenceKey, referenceName) => {
  const result = await client.getEntries({
    content_type: 'property',
    select: 'sys.id,fields.coverImage,fields.images',
    'fields.referenceKey': referenceKey,
    'fields.referenceName': referenceName,
  })
  .catch(error => error);
  const item = _.get(result, 'items.0');
  return _.get(result, 'items.0.sys.id') ? {
    id: item.sys.id,
    coverImage: _.get(item, 'fields.coverImage.sys.id'),
    images: _.size(_.get(item, 'fields.images')) > 0 ? _.map(item.fields.images, (image) => {
      return image.sys.id;
    }) : [],
  } : false;
};

export const deletePropertyApi = async (id) => {
  const entry = await client.getEntry(id).catch(console.error);

  const oldCoverImageId = _.get(entry, 'fields.coverImage.sys.id');
  const oldImagesIds = _.size(_.get(entry, 'fields.images')) > 0 ? _.map(entry.fields.images, (image) => {
      return image.sys.id;
    }) : [];

  const result = await clientManagement.getSpace(process.env.CONTENTFUL_SPACE)
  .then(space => space.getEntry(id))
  .then(entry => entry.unpublish())
  .then(entry => entry.delete())
  .then(() => console.log('Entry deleted.', id))
  .catch(console.error);

  await deleteImage(oldCoverImageId);

  for (let k = 0; k < _.size(oldImagesIds); k += 1) {
    await deleteImage(oldImagesIds[k]);
  }

  return result;
};

export const createPropertyApi = async (data, updateImage = 'false') => {

  const referenceKey = _.get(data, 'referenceKey');
  const referenceName = _.get(data, 'referenceName');

  const hasProperty = await vendorHasProperty(referenceKey, referenceName);

  const updateId = _.get(hasProperty, 'id');
  const oldCoverImageId = _.get(hasProperty, 'coverImage');
  const oldImagesIds = _.get(hasProperty, 'images');

  let coverImage = {};
  let coverImageId = false;

  if ( (!updateId) || (updateImage === 'true' && updateId) ) {
    if (_.get(data, 'coverImage')) {
      const coverImageResult = await uploadImage(data.coverImage);
      if (_.get(coverImageResult, 'sys.id')) {
        coverImageId = true;
        coverImage = {
          sys: {
            id: coverImageResult.sys.id,
            linkType: 'Asset',
            type: 'Link',
          },
        };
      }
    }
  }

  let images = [];
  let imagesId = false;

  if ( (!updateId) || (updateImage === 'true' && updateId) ) {
    if (_.get(data, 'images')) {
      for (let i = 0; i < _.size(data.images); i += 1) {
        const image = data.images[i];
        const imagesResult = await uploadImage(image);
        if (_.get(imagesResult, 'sys.id')) {
          imagesId = true;
          images.push({
            sys: {
              id: imagesResult.sys.id,
              linkType: 'Asset',
              type: 'Link',
            },
          });
        }
      }
    }
  }

  const fieldsData = {
    fields: {
      propertyType: {
        'en-US': _.get(data, 'propertyType'),
      },
      nameEn: {
        'en-US': _.get(data, 'nameEn'),
      },
      nameTh: {
        'en-US': _.get(data, 'nameTh'),
      },
      description: {
        'en-US': {
          en: _.get(data, 'descriptionEn'),
          th: _.get(data, 'descriptionTh'),
        },
      },
      location: {
        'en-US': {
          soi: '',
          full: {
            en: _.get(data, 'fullAddressEn'),
            th: _.get(data, 'fullAddressTh'),
          },
          areas: [],
          mooNo: '',
          street: '',
          unitNo: '',
          floorNo: '',
          summary: {
            en: '',
            th: '',
          },
          zipcode: '',
          district: '',
          latitude: '',
          province: '',
          longitude: '',
          buildingNo: '',
          subDistrict: '',
          publicTransports: [
            {
              name: '0',
              type: 'BTS',
              distance: 0,
            },
            {
              name: '0',
              type: 'MRT',
              distance: 0,
            },
            {
              name: '0',
              type: 'BRT',
              distance: 0,
            },
          ],
        },
      },
      attributes: {
        'en-US': {
          numFloors: '',
          yearBuilt: '',
          numBedrooms: '',
          numBathrooms: '',
        },
      },
      areaLand: {
        'en-US': {
          unit: '',
          value: '',
          width: '',
          detail: '',
          height: '',
        },
      },
      forSale: {
        'en-US': _.get(data, 'for') === 'sale' ? true : false,
      },
      forRent: {
        'en-US': _.get(data, 'for') === 'rent' ? true : false,
      },
      priceSale: {
        'en-US': {
          type: '',
          until: '',
          value: _.get(data, 'for') === 'sale' ? _.get(data, 'price') : '',
          detail: '',
          currency: _.get(data, 'currency'),
          discount: 0,
        },
      },
      priceRent: {
        'en-US': {
          type: '',
          until: '',
          value: _.get(data, 'for') === 'rent' ? _.get(data, 'price') : '',
          detail: '',
          currency: _.get(data, 'currency'),
          discount: 0,
        },
      },
      tags: {
        'en-US': _.get(data, 'tags'),
      },
      numBedrooms: {
        'en-US': _.toNumber(_.get(data, 'bedroom')),
      },
      numBathrooms: {
        'en-US': _.toNumber(_.get(data, 'bathroom')),
      },
      locationMarker: {
        'en-US': {
          lon: _.toNumber(_.get(data, 'location.lng')),
          lat: _.toNumber(_.get(data, 'location.lat')),
        },
      },
      priceSaleValue: {
        'en-US': _.get(data, 'for') === 'sale' ? _.toNumber(_.get(data, 'price')) : 0,
      },
      priceRentValue: {
        'en-US': _.get(data, 'for') === 'rent' ? _.toNumber(_.get(data, 'price')) : 0,
      },
      province: {
        'en-US': _.get(data, 'province'),
      },
      projectNameEn: {
        'en-US': _.get(data, 'project_en'),
      },
      projectNameTh: {
        'en-US': _.get(data, 'project_th'),
      },
      areaSize: {
        'en-US': _.toNumber(_.get(data, 'areaSize')),
      },
      agent: {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: _.get(data, 'userId'),
          },
        },
      },
      enable: {
        'en-US': true,
      },
      approve: {
        'en-US': true,
      },
      referenceName: {
        'en-US': referenceName,
      },
      referenceKey: {
        'en-US': referenceKey,
      },
    },
  };

  if (coverImageId) {
    _.set(fieldsData.fields, 'coverImage.en-US', coverImage);
  }

  if (imagesId) {
    _.set(fieldsData.fields, 'images.en-US', images);
  }

  let result = {};

  if (updateId) {
    result = await clientManagement.getSpace(process.env.CONTENTFUL_SPACE)
    .then(space => space.getEntry(updateId))
    .then((entry) => {
      _.map(fieldsData.fields, (field, key) => {
        entry.fields[key] = field;
      })
      return entry.update();
    })
    .then(entry => entry.publish())
    .catch(error => error);
  } else {
    result = await clientManagement.getSpace(process.env.CONTENTFUL_SPACE)
    .then(space => space.createEntry('property', fieldsData))
    .then(entry => entry.publish())
    .catch(error => error);
  }

  if (updateImage === 'true' && updateId) {
    await deleteImage(oldCoverImageId);

    for (let k = 0; k < _.size(oldImagesIds); k += 1) {
      await deleteImage(oldImagesIds[k]);
    }
  }

  return result;
};

export const deleteAll = async () => {
  const result = await client.getAssets({
    select: 'sys.id',
  })
  .catch(error => error);
  for (let i = 0; i < _.size(result.items); i += 1) {
    const item = result.items[i];
    const assetId = item.sys.id;
    const deleteResult = await clientManagement.getSpace(process.env.CONTENTFUL_SPACE)
    .then(space => space.getAsset(assetId))
    .then(asset => asset.unpublish())
    .then(asset => asset.delete())
    .then(() => console.log('Asset deleted.', i))
    .catch(console.error);
  }
  return result;
};

export const deleteAll2 = async () => {
  const result = await client.getEntries({
    content_type: 'property',
    select: 'sys.id',
  })
  .catch(error => error);
  for (let i = 0; i < _.size(result.items); i += 1) {
    const item = result.items[i];
    const entryId = item.sys.id;
    const deleteResult = await clientManagement.getSpace(process.env.CONTENTFUL_SPACE)
    .then(space => space.getEntry(entryId))
    .then(entry => entry.unpublish())
    .then(entry => entry.delete())
    .then(() => console.log('Entry deleted.', i))
    .catch(console.error)
  }
  return result;
};

export const getPropertiesByVendor = async (vendor) => {
  const result = await client.getEntries({
    content_type: 'property',
    select: 'fields.referenceKey',
    'fields.referenceName': vendor,
  })
  .catch(error => error);
  let ids = []
  if (_.size(result.items) > 0) {
    ids = _.map(result.items, (item) => {
      return item.fields.referenceKey;
    });
  }
  return ids;
};

export const getPropertiesById = async (id) => {
  const result = await client.getEntries({
    content_type: 'property',
    'sys.id': id,
  })
  .catch(error => error);
  return result;
};
