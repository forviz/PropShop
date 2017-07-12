import _ from 'lodash';
import queryString from 'query-string';
import { uploadFile } from './contentful';

const BASEURL = 'http://localhost:4000/api/v1';

// const convertToURLParam = data => `?${_.join(_.map(data, (value, key) => `${key}=${value}`), '&')}`;

const mapContentFulPropertyToMyField = (data) => {
  console.log('mapContentFulPropertyToMyField', data);
  return _.reduce(data, (acc, elem, index) => {
    const forSale = _.get(elem, 'fields.forSale') === true;
    return {
      ...acc,
      [index]: {
        id: elem.sys.id,
        address: _.get(elem, 'fields.location.full.th'),
        agentId: '',
        amphur: _.get(elem, 'fields.location.district'),
        announceDetails: _.get(elem, 'fields.description.th', ''),
        areaSize: _.get(elem, 'fields.areaUsable.value'),
        bathroom: _.get(elem, 'fields.numBedrooms'),
        bedroom: _.get(elem, 'fields.numBathrooms'),
        district: _.get(elem, 'fields.location.subDistrict'),
        fee: 0,
        for: forSale ? 'ขาย' : 'เช่า',
        location: {
          lat: _.get(elem, 'fields.location.latitude'),
          lon: _.get(elem, 'fields.location.longitude'),
        },
        price: forSale ? _.get(elem, 'fields.priceSale.value') : _.get(elem, 'fields.priceRent.value'),
        project: _.replace(_.get(elem, 'fields.name.eh'), `Unit ${_.get(elem, 'fields.location.unitNo')}`),
        province: _.get(elem, 'fields.location.province'),
        residentialType: _.get(elem, 'fields.propertyType'),
        sold: false,
        specialFeatureFacilities: _.get(elem, 'fields.tags'),
        specialFeatureNearbyPlaces: [],
        street: _.get(elem, 'fields.location.street'),
        topic: _.get(elem, 'fields.name.th'),
        zipcode: _.get(elem, 'fields.location.zipcode'),
        createdAt: elem.sys.createdAt,
        updatedAt: elem.sys.updatedAt,
        mainImage: _.get(elem, 'fields.coverImage.fields.file.url'),
        images: _.map(_.get(elem, 'fields.images'), (image) => {
          return _.get(image, 'fields.file.url');
        }),
        // Extra
        publicTransports: _.get(elem, 'fields.location.publicTransports'),
        unitNo: _.get(elem, 'fields.location.unitNo'),
        floorNo: _.get(elem, 'fields.location.floorNo'),
        buildingNo: _.get(elem, 'fields.location.buildingNo'),
      },
    };
  }, {});
};

export const getProperties = (search) => {
  console.log('getProperties', search);
  // const searchEntries = {};
  // searchEntries.content_type = 'property';
  // if (search.id) searchEntries['sys.id'] = search.id;
  // if (search.for === 'ขาย' || search.for === 'sale') searchEntries.for = 'sale';
  // if (search.for === 'เช่า' || search.for === 'rent') searchEntries.for = 'rent';
  // if (search.query) searchEntries.query = search.query;
  // if (search.residentialType) searchEntries['fields.residentialType'] = search.residentialType;
  // if (search.bedroom) searchEntries.bedroom = parseInt(search.bedroom, 10);
  // if (search.bathroom) searchEntries.bathroom = parseInt(search.bathroom, 10);
  // if (search.priceMin) searchEntries.priceMin = parseInt(search.priceMin, 10);
  // if (search.priceMax) searchEntries.priceMax = parseInt(search.priceMax, 10);
  // if (search.specialFeatureView) searchEntries.specialFeatureView = search.specialFeatureView;
  // if (search.specialFeatureFacilities) searchEntries.specialFeatureFacilities = search.specialFeatureFacilities;
  // if (search.specialFeatureNearbyPlaces) searchEntries.specialFeatureNearbyPlaces = search.specialFeatureNearbyPlaces;
  // if (search.specialFeaturePrivate) searchEntries.specialFeaturePrivate = search.specialFeaturePrivate;
  // // if (search.location) searchEntries['fields.location[within]'] = `${search.location},${search.radius}`;
  // if (search.bound) searchEntries.bound = search.bound;
  // return fetch(`${BASEURL}/properties${convertToURLParam(searchEntries)}`, {
  //   'Content-Type': 'application/json',
  // })
  return fetch(`${BASEURL}/properties${search}`, {
    'Content-Type': 'application/json',
  })
  .then(response => response.json())
  .then((response) => {
    let mapResult = mapContentFulPropertyToMyField(response.items);

    const searchObj = queryString.parse(search);

    if (searchObj.select) {
      mapResult = _.map(mapResult, (value) => {
        return _.pick(value, searchObj.select.split(','));
      });
    }

    return mapResult;
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
