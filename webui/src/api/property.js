import _ from 'lodash';
import { uploadFile } from './contentful';
import { mapContentFulPropertyToMyField } from '../modules/property/api';

const BASEURL = process.env.REACT_APP_MYAPI_URL;

// const convertToURLParam = data => `?${_.join(_.map(data, (value, key) => `${key}=${value}`), '&')}`;

// export const mapContentFulPropertyToMyField = (data) => {
//   const noImage = 'http://www.novelupdates.com/img/noimagefound.jpg';
//   return _.reduce(data, (acc, elem, index) => {
//     const forSale = _.get(elem, 'fields.forSale') === true;
//     return {
//       ...acc,
//       [index]: {
//         id: elem.sys.id,
//         address: _.get(elem, 'fields.location.unitNo'),
//         agentId: '',
//         amphur: _.get(elem, 'fields.location.district'),
//         announceDetails: _.get(elem, 'fields.description.th', ''),
//         areaSize: _.get(elem, 'fields.areaUsable.value'),
//         bathroom: _.get(elem, 'fields.numBedrooms'),
//         bedroom: _.get(elem, 'fields.numBathrooms'),
//         district: _.get(elem, 'fields.location.subDistrict'),
//         fee: 0,
//         for: forSale ? 'ขาย' : 'เช่า',
//         location: {
//           lat: _.get(elem, 'fields.location.latitude'),
//           lon: _.get(elem, 'fields.location.longitude'),
//         },
//         price: forSale ? _.get(elem, 'fields.priceSale.value') : _.get(elem, 'fields.priceRent.value'),
//         project: _.replace(_.get(elem, 'fields.name.eh'), `Unit ${_.get(elem, 'fields.location.unitNo')}`),
//         province: _.get(elem, 'fields.location.province'),
//         residentialType: _.get(elem, 'fields.propertyType'),
//         sold: false,
//         specialFeatureFacilities: _.get(elem, 'fields.tags'),
//         specialFeatureNearbyPlaces: [],
//         street: _.get(elem, 'fields.location.street'),
//         topic: _.get(elem, 'fields.name.th'),
//         zipcode: _.get(elem, 'fields.location.zipcode'),
//         createdAt: elem.sys.createdAt,
//         updatedAt: elem.sys.updatedAt,
//         mainImage: _.get(elem, 'fields.coverImage.fields.file.url') ? _.get(elem, 'fields.coverImage.fields') : {
//           file: {
//             url: noImage,
//           },
//         },
//         images: _.map(_.get(elem, 'fields.images'), (image) => {
//           return _.get(image, 'fields.file.url') ? _.get(image, 'fields') : {
//             file: {
//               url: noImage,
//             },
//           };
//         }),
//         // Extra
//         publicTransports: _.get(elem, 'fields.location.publicTransports'),
//         unitNo: _.get(elem, 'fields.location.unitNo'),
//         floorNo: _.get(elem, 'fields.location.floorNo'),
//         buildingNo: _.get(elem, 'fields.location.buildingNo'),
//       },
//     };
//   }, {});
// };

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

// export async function createRealEstate(data, user) {
//   const assetsMainImage = await uploadFile(data.step2.mainImage.name, data.step2.mainImage.type, data.step2.mainImage);
//
//   let imageData = {};
//   let imageIds = [];
//
//   await Promise.all(data.step2.images.map(async (image) => {
//     let assetsImages = await uploadFile(image.name, image.type, image);
//     imageIds.push(assetsImages.sys.id);
//   }));
//
//   const realEstateFields = parseRealEstateData(data, assetsMainImage.sys.id, imageIds);
//
//   return clientManagement.getSpace(process.env.REACT_APP_SPACE)
//   .then((space) => {
//     space.createEntry('realEstate', {
//       fields: realEstateFields,
//     })
//     .then((entry) => {
//       return entry;
//     })
//     .catch(console.error)
//   });
// }

export const createProperty = (data, userId) => {
  return fetch(`${BASEURL}/property`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data, userId }),
  })
  .then((response) => {
    return response.json();
  });
};

export const updateProperty = (id, data) => {
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
