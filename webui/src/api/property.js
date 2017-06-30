import _ from 'lodash';
import { uploadFile } from './contentful';

const BASEURL = 'http://localhost:4000/api/v1';

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


// export const uploadFile = (fileName = '', fileType = '', file = '') => {
//   return fetch(`${BASEURL}/media`, {
//     method: 'POST',
//     body: JSON.stringify({
//       fileName,
//       fileType,
//       file,
//     }),
//   })
//   .then((response) => {
//     console.log(response);
//     return response;
//   })
// }

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
