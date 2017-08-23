import _ from 'lodash';
import moment from 'moment';
import * as contentfulManagement from 'contentful-management';

const clientManagement = contentfulManagement.createClient({
  accessToken: process.env.REACT_APP_ACCESSTOKEN_MANAGEMENT,
});

const BASEURL = process.env.REACT_APP_MYAPI_URL;

export const uploadFile = (fileName = '', fileType = '', file = '') => {
  return clientManagement.getSpace(process.env.REACT_APP_SPACE)
  .then(space => space.createAssetFromFiles({
    fields: {
      title: {
        'en-US': fileName,
      },
      file: {
        'en-US': {
          contentType: 'application/octet-stream',
          fileName,
          file,
        },
      },
    },
  }))
  .then(asset => asset.processForAllLocales())
  .then(asset => asset.publish())
  .catch(console.error);
};

export const mapContentFulPropertyToMyField = (data, realTime = '0') => {
  // const noImage = 'http://www.novelupdates.com/img/noimagefound.jpg';
  return _.reduce(data, (acc, elem, index) => {
    const newFields = realTime === '1' ? _.mapValues(elem.fields, field => field['en-US']) : elem.fields;
    const forSale = _.get(newFields, 'forSale') === true;
    const noImage = 'http://www.novelupdates.com/img/noimagefound.jpg';
    return {
      ...acc,
      [index]: {
        ...elem.fields,
        id: elem.sys.id,
        address: _.get(newFields, 'location.full.th'),
        amphur: _.get(newFields, 'location.district'),
        announceDetails: _.get(newFields, 'description.th', ''),
        areaSize: _.get(newFields, 'areaSize'),
        bathroom: _.get(newFields, 'numBedrooms'),
        bedroom: _.get(newFields, 'numBathrooms'),
        district: _.get(newFields, 'location.subDistrict'),
        fee: 0,
        for: forSale ? 'ขาย' : 'เช่า',
        location: {
          ...elem.fields.location,
          lat: _.get(newFields, 'locationMarker.lat'),
          lon: _.get(newFields, 'locationMarker.lon'),
        },
        price: forSale ? _.get(newFields, 'priceSale.value') : _.get(newFields, 'priceRent.value'),
        project: _.get(newFields, 'projectNameEn') || _.get(newFields, 'projectNameTh') ||
        _.get(newFields, 'projectName') || _.get(newFields, 'nameEn') || _.get(newFields, 'nameTh'),
        province: _.get(newFields, 'province') || _.get(newFields, 'location.province'),
        residentialType: _.get(newFields, 'propertyType'),
        sold: false,
        // specialFeatureFacilities: _.get(newFields, 'tags'),
        // specialFeatureNearbyPlaces: [],
        street: _.get(newFields, 'location.street'),
        tags: _.get(newFields, 'tags'),
        topic: _.get(newFields, 'nameTh'),
        zipcode: _.get(newFields, 'location.zipcode'),
        createdAt: elem.sys.createdAt,
        updatedAt: elem.sys.updatedAt,
        // mainImage: _.get(newFields, 'coverImage.fields'),
        // images: _.get(newFields, 'images.fields'),
        mainImage: _.get(newFields, 'coverImage.fields.file.url') ? { ..._.get(newFields, 'coverImage.fields'), id: _.get(newFields, 'coverImage.sys.id') } : {
          file: {
            url: noImage,
          },
        },
        images: _.get(newFields, 'images') ? _.map(_.get(newFields, 'images'), (image) => {
          return _.get(image, 'fields.file.url') ? { ..._.get(image, 'fields'), id: _.get(image, 'sys.id') } : {
            file: {
              url: noImage,
            },
          };
        }) : [],
        // Extra
        publicTransports: _.get(newFields, 'location.publicTransports'),
        unitNo: _.get(newFields, 'location.unitNo'),
        floorNo: _.get(newFields, 'location.floorNo'),
        buildingNo: _.get(newFields, 'location.buildingNo'),
        inWebsite: moment().diff(moment(elem.sys.createdAt), 'days') === 0 ? 1 : moment().diff(moment(elem.sys.createdAt), 'days'),
        // lastUpdate: moment(elem.sys.updatedAt).format('D/M/YYYY h:mm A'),
        lastUpdate: moment(elem.sys.updatedAt).format('D/M/YYYY'),
        agent: {
          id: _.get(newFields, 'agent.sys.id'),
          image: _.get(newFields, 'agent.fields.image.fields.file.url'),
          name: _.get(newFields, 'agent.fields.name'),
          lastname: _.get(newFields, 'agent.fields.lastname'),
          phone: _.get(newFields, 'agent.fields.phone'),
          email: _.get(newFields, 'agent.fields.email'),
          username: _.get(newFields, 'agent.fields.username'),
        },
        postDate: moment(elem.sys.createdAt).locale('th').format('DD MMM YYYY'),
        enable: _.get(newFields, 'enable') ? _.get(newFields, 'enable') : false,
        approve: _.get(newFields, 'approve') ? _.get(newFields, 'approve') : false,
      },
    };
  }, {});
};

export const getPropertyIDs = (search) => {
  // console.log('getPropertyIDs', search);
  return fetch(`${BASEURL}/properties${search}&select=fields.propertyType`, {
    'Content-Type': 'application/json',
  })
  .then(response => response.json())
  .then((response) => {
    return {
      total: response.total,
      itemIds: _.map(response.items, item => item.sys.id),
    };
  });
};

export const getProperties = (search) => {
  // console.log('getProperties', search);
  return fetch(`${BASEURL}/properties${search}`, {
    'Content-Type': 'application/json',
  })
  .then(response => response.json())
  .then((response) => {
    return {
      data: mapContentFulPropertyToMyField(response.items, _.get(response, 'realTime')),
      total: response.total,
    };
  });
};

const parseRealEstateData = (data, mainImageId, imageIds) => {
  return {
    topic: _.get(data, 'step0.topic'),
    detail: _.get(data, 'step0.announcementDetails'),
    for: _.get(data, 'step0.for'),
    price: _.toNumber(_.get(data, 'step0.price')),
    agent: {
      id: 802,
      name: 'James Bond',
      email: 'jamesbond@agent.com',
      phone: '09xxxxxxx',
    },
    property: {
      id: undefined,
      residentialType: _.get(data, 'step0.residentialType'),
      usableArea: {
        size: 36,
        description: _.toString(_.get(data, 'step0.areaSize')),
        unit: 'm',
      },
      landArea: {
        size: 60,
        description: _.toString(_.get(data, 'step0.landSize')),
        unit: 'm',
      },
      bedroom: _.toNumber(_.get(data, 'step0.bedroom')),
      bathroom: _.toNumber(_.get(data, 'step0.bathroom')),
      price: _.toNumber(_.get(data, 'step0.price')),
      fee: _.toNumber(_.get(data, 'step0.fee')),
      project: {},
      location: {
        addressText: '',
        areaIds: [],
        lat: _.get(data, 'step0.googleMap.markers[0].position.lat'),
        lng: _.get(data, 'step0.googleMap.markers[0].position.lng'),
        zipcode: _.get(data, 'step0.zipcode'),
        province: _.get(data, 'step0.province'),
        amphur: _.get(data, 'step0.amphur'),
        district: _.get(data, 'step0.district'),
        street: _.get(data, 'step0.street'),
      },
      features: [],
      specialFeatureView: _.get(data, 'step1.specialFeatureView'),
      specialFeatureFacilities: _.get(data, 'step1.specialFeatureFacilities'),
      specialFeatureNearbyPlaces: _.get(data, 'step1.specialFeatureNearbyPlaces'),
      mainImage: { id: mainImageId, caption: '' },
      images: _.map(imageIds, imgId => ({ id: imgId, caption: '', albumCover: (mainImageId === imgId) })),
    },
  };
};

export const createPost = async (data) => {
  console.log('createPost', data);
  const assetsMainImage = await uploadFile(data.step2.mainImage.name, data.step2.mainImage.type, data.step2.mainImage);
  console.log('assetsMainImage', assetsMainImage);
  const imageIds = [];

  await Promise.all(data.step2.images.map(async (image) => {
    const assetsImages = await uploadFile(image.name, image.type, image);
    imageIds.push(assetsImages.sys.id);
  }));

  const realEstateFields = parseRealEstateData(data, assetsMainImage.sys.id, imageIds);
  // const realEstateFields = parseRealEstateData(data);
  console.log('realEstateFields', realEstateFields);

  return fetch(`${BASEURL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...realEstateFields,
    }),
  })
  .then((response) => {
    console.log(response);
    return response;
  });
};

export const getPropertyById = (id) => {
  return fetch(`${BASEURL}/property/${id}`, {
    'Content-Type': 'application/json',
  })
  .then(response => response.json())
  .then((response) => {
    const data = [];
    data[0] = response;
    const result = mapContentFulPropertyToMyField(data);
    return result[0];
  });
};

export const createPropertyApi = (data, userId, userEmail, userName) => {
  return fetch(`${BASEURL}/property`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data, userId, userEmail, userName }),
  })
  .then((response) => {
    return response.json();
  });
};

export const updatePropertyApi = (id, data) => {
  return fetch(`${BASEURL}/property/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...data }),
  })
  .then((response) => {
    return response.json();
  });
};

export const deletePropertyApi = (id) => {
  return fetch(`${BASEURL}/property/${id}`, {
    method: 'DELETE',
  })
  .then((response) => {
    return response.json();
  });
};

export const propertyShare = (name, email, sendTo, project, propertyUrl) => {
  return fetch(`${BASEURL}/property/share/email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, sendTo, project, propertyUrl }),
  })
  .then((response) => {
    return response.json();
  });
};
