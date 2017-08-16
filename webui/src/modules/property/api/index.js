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

export const mapContentFulPropertyToMyField = (data) => {
  // const noImage = 'http://www.novelupdates.com/img/noimagefound.jpg';
  return _.reduce(data, (acc, elem, index) => {
    const forSale = _.get(elem, 'fields.forSale') === true;
    const noImage = 'http://www.novelupdates.com/img/noimagefound.jpg';
    return {
      ...acc,
      [index]: {
        id: elem.sys.id,
        address: _.get(elem, 'fields.location.full.th'),
        amphur: _.get(elem, 'fields.location.district'),
        announceDetails: _.get(elem, 'fields.description.th', ''),
        areaSize: _.get(elem, 'fields.areaSize'),
        bathroom: _.get(elem, 'fields.numBedrooms'),
        bedroom: _.get(elem, 'fields.numBathrooms'),
        district: _.get(elem, 'fields.location.subDistrict'),
        fee: 0,
        for: forSale ? 'ขาย' : 'เช่า',
        location: {
          lat: _.get(elem, 'fields.locationMarker.lat'),
          lon: _.get(elem, 'fields.locationMarker.lon'),
        },
        price: forSale ? _.get(elem, 'fields.priceSale.value') : _.get(elem, 'fields.priceRent.value'),
        project: _.get(elem, 'fields.projectNameEn') || _.get(elem, 'fields.nameEn'),
        province: _.get(elem, 'fields.province') || _.get(elem, 'fields.location.province'),
        residentialType: _.get(elem, 'fields.propertyType'),
        sold: false,
        // specialFeatureFacilities: _.get(elem, 'fields.tags'),
        // specialFeatureNearbyPlaces: [],
        street: _.get(elem, 'fields.location.street'),
        tags: _.get(elem, 'fields.tags'),
        topic: _.get(elem, 'fields.nameTh'),
        zipcode: _.get(elem, 'fields.location.zipcode'),
        createdAt: elem.sys.createdAt,
        updatedAt: elem.sys.updatedAt,
        // mainImage: _.get(elem, 'fields.coverImage.fields'),
        // images: _.get(elem, 'fields.images.fields'),
        mainImage: _.get(elem, 'fields.coverImage.fields.file.url') ? _.get(elem, 'fields.coverImage.fields') : {
          file: {
            url: noImage,
          },
        },
        images: _.get(elem, 'fields.images') ? _.map(_.get(elem, 'fields.images'), (image) => {
          return _.get(image, 'fields.file.url') ? _.get(image, 'fields') : {
            file: {
              url: noImage,
            },
          };
        }) : [],
        // Extra
        publicTransports: _.get(elem, 'fields.location.publicTransports'),
        unitNo: _.get(elem, 'fields.location.unitNo'),
        floorNo: _.get(elem, 'fields.location.floorNo'),
        buildingNo: _.get(elem, 'fields.location.buildingNo'),
        inWebsite: moment().diff(moment(elem.sys.createdAt), 'days') === 0 ? 1 : moment().diff(moment(elem.sys.createdAt), 'days'),
        lastUpdate: moment(elem.sys.updatedAt).format('D/M/YYYY h:mm A'),
        agent: {
          id: _.get(elem, 'fields.agent.sys.id'),
          image: _.get(elem, 'fields.agent.fields.image.fields.file.url'),
          name: _.get(elem, 'fields.agent.fields.name'),
          lastname: _.get(elem, 'fields.agent.fields.lastname'),
          phone: _.get(elem, 'fields.agent.fields.phone'),
          email: _.get(elem, 'fields.agent.fields.email'),
          username: _.get(elem, 'fields.agent.fields.username'),
        },
        postDate: moment(elem.sys.createdAt).locale('th').format('d MMM YYYY'),
        enable: _.get(elem, 'fields.enable') ? _.get(elem, 'fields.enable') : false,
        approve: _.get(elem, 'fields.approve') ? _.get(elem, 'fields.approve') : false,
      },
    };
  }, {});
};

export const getPropertyIDs = (search) => {
  // console.log('getPropertyIDs', search);
  return fetch(`${BASEURL}/properties${search}&select=sys.id`, {
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
    console.log('getProperties', response);
    return {
      data: mapContentFulPropertyToMyField(response.items),
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
  })
}

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

export const updatePropertyApi = (id, data) => {
  return fetch(`${BASEURL}/property/${id}`, {
    method: 'POST',
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
