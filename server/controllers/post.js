import * as contentful from 'contentful';
import * as contentfulManagement from 'contentful-management';
import _ from 'lodash';
import moment from 'moment';
const fs = require('fs');
const path = require('path');    
    // filePath = path.join(__dirname, 'start.html');

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_ACCESSTOKEN,
});

const clientManagement = contentfulManagement.createClient({
  accessToken: process.env.CONTENTFUL_ACCESSTOKEN_MANAGEMENT,
});

const contentfulDateFormat = 'YYYY-MM-DDTHH:mm:s.SSSZ'; //2015-05-18T11:29:46.809Z


export const uploadFile = async (req, res) => {
  try {

    if (!req.file) {
      res.status(400).json({
        status: 400,
        code: 'InvalidQueryError',
        title: 'The request contained invalid or unknown query parameters.',
      });
    }

    const file = req.file;
    const response = await clientManagement.getSpace(process.env.CONTENTFUL_SPACE)
    .then(space => space.createAssetFromFiles({
      fields: {
        title: {
          'en-US': file.originalname,
        },
        file: {
          'en-US': {
            contentType: 'application/octet-stream',
            fileName: file.originalname,
            file: file.buffer,
          }
        }
      }
    }))
    .then(asset => asset.processForAllLocales())
    .then(asset => asset.publish());

    if (!_.get(response, 'sys.id')) {
      res.status(500).json({
        status: 500,
        code: 'ServerError',
        title: 'Something went wrong on servers.',
      });
    }

    res.json({
      data: response,
    });

  } catch (e) {
    res.status(500).json({
      status: 500,
      code: 'ServerError',
      title: 'Something went wrong on servers.',
    });
  }
}

export const queryPosts = async (req, res, next) => {
  try {
    const { id, query, residentialType, bedroom, bathroom, priceMin, priceMax } = req.query;
    const _for = req.query.for;

    const propertyQuery = _.omitBy({
      content_type: 'realEstate',
      'sys.id': id,
      query,
      'fields.for[in]': _for,
      'fields.residentialType': residentialType,
      'fields.bedroom': bedroom,
      'fields.bathroom': bathroom,
      'fields.price[gte]': priceMin,
      'fields.price[lte]': priceMax,
    }, _.isEmpty);

    const response = await client.getEntries(propertyQuery);
    res.json(response);
  } catch (e) {
    res.status(500).json({
      status: 'ERROR',
      message: e.message,
    });
  }
}

const extractAgentFields = (data) => {
  return {
    name: { 'en-US': _.get(data, 'agent.name') },
    email: { 'en-US': _.get(data, 'agent.email') },
    phone: { 'en-US': _.get(data, 'agent.phone') },
  }
};


const extractPropertyFields = (data) => {

  const mainImage = _.get(data, 'property.mainImage');
  const images = _.get(data, 'property.images');
  // const mainImage = _.find(images, image => image.albumCover === true);
  return {
    for: { 'en-US': _.get(data, 'for') },
    residentialType: { 'en-US': _.get(data, 'property.residentialType') },
    usableArea: { 'en-US': _.get(data, 'property.usableArea') },
    landArea: { 'en-US': _.get(data, 'property.landArea') },
    areaSize: { 'en-US': _.toString(_.get(data, 'property.usableArea.size')) },
    landSize: { 'en-US': _.toString(_.get(data, 'property.landArea.size')) },
    bedroom: { 'en-US': _.get(data, 'property.bedroom') },
    bathroom: { 'en-US': _.get(data, 'property.bathroom') },
    price: { 'en-US': _.toNumber(_.get(data, 'property.price')) },
    fee: { 'en-US': _.get(data, 'property.fee') },
    // projectLink: {
    //   'sys': {
    //     id: _.get(data, 'property.project.id'),
    //     linkType: "Entry",
    //     type: "Link"
    //   },
    // },
    locationObject: {
      'en-US': _.get(data, 'property.location'),
    },
    specialFeatureView: {
      'en-US': _.get(data, 'property.specialFeatureView'),
    },
    specialFeatureFacilities: {
      'en-US': _.get(data, 'property.specialFeatureFacilities'),
    },
    specialFeatureNearbyPlaces: {
      'en-US': _.get(data, 'property.specialFeatureNearbyPlaces'),
    },
    zipcode: { 'en-US': _.get(data, 'property.location.zipcode') },
    province: { 'en-US': _.get(data, 'property.location.province') },
    amphur: { 'en-US': _.get(data, 'property.location.amphur') },
    district: { 'en-US': _.get(data, 'property.location.district') },
    address: { 'en-US': _.get(data, 'property.location.address') },
    street: { 'en-US': _.get(data, 'property.location.street') },
    location: { 'en-US': {
      lat: _.get(data, 'property.location.lat'),
      lon: _.get(data, 'property.location.lng'),
    }},
    mainImage: mainImage ? {
      'en-US': {
        'sys': {
          'id': mainImage.id,
          'linkType': 'Asset',
          'type': 'Link',
        }
      }
    } : undefined,
    images: {
      'en-US': _.map(images, image => {
        return {
          'sys': {
            id: image.id,
            linkType: "Asset",
            type: "Link"
          },
        };
      }),
    },
  }
}

const extractPostFields = (data, agentEntry, realEstateEntry) => {
  return {
    topic: { 'en-US': _.get(data, 'topic') },
    detail: { 'en-US': _.get(data, 'detail') },
    for: {
      'en-US': [_.get(data, 'for')]
    },
    agent: {
      'en-US': {
        sys: {
          id: agentEntry.sys.id,
          linkType: 'Entry',
          type: 'Link'
        },
      },
    },
    property: {
      'en-US': {
        sys: {
          id: realEstateEntry.sys.id,
          linkType: 'Entry',
          type: 'Link'
        },
      },
    },
    startDate: { 'en-US': _.get(data, 'startDate', moment()) },
    endDate: { 'en-US': _.get(data, 'endDate',  moment().add(7, 'days')) },
  }
}

export const createPost = async (req, res, next) => {
  try {
    const data = req.body;
    console.log('data', data);
    const space = await clientManagement.getSpace(process.env.CONTENTFUL_SPACE)

    // Create Agent
    const agentFields = extractAgentFields(data);

    // Find existing Agent
    const agentEntries = await space.getEntries({
      content_type: 'agent', 'fields.email': _.get(agentFields, 'email.en-US'),
    });
    const agentEntry = _.head(agentEntries.items);
    let agentId = _.get(agentEntry, 'sys.id');

    if (!agentId) {
      const newAgentEntry = await space.createEntry('agent', {
        fields: extractAgentFields(data),
      }).then(entry => entry.publish());
      agentId = _.get(newAgentEntry, 'sys.id');
    }

    console.log('agentId', agentId);

    // Create Real Estate
    const realEstateFields = extractPropertyFields(data);
    console.log('realEstateFields', realEstateFields);
    const realEstateEntry = await space.createEntry('realEstate', {
      fields: realEstateFields,
    });

    console.log('realEstate', realEstateEntry);

    // // Create Post
    const postEntry = await space.createEntry('post', {
      fields: extractPostFields(data, agentEntry, realEstateEntry),
    });

    res.json({
      status: 'SUCCESS',
      data: {
        realEstate: realEstateEntry,
      },
    })

  } catch (e) {
    next(e);
  }
};


export const importPost = async (req, res) => {

};

export const deleteFile = async (req, res) => {

  try {
    const { assetId } = req.params;

    const response = await clientManagement.getSpace(process.env.CONTENTFUL_SPACE)
    .then((space) => space.getAsset(assetId))
    .then((asset) => asset.unpublish())
    .then((asset) => asset.delete())
    .then(() => console.log('Asset deleted.'))
    .catch(console.error)

    res.json(response);

  } catch (e) {
    console.error(e);
    res.json({
      error: e.message,
    });
  }
}
