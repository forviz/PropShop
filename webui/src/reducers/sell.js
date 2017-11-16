import _ from 'lodash';

const initalState = {
  step: 0,
  step0: {
    requiredField: ['for', 'residentialType', 'topic', 'announcementDetails', 'areaSize',
      'bedroom', 'bathroom', 'price', 'province', 'amphur', 'district', 'location', 'address', 'street', 'zipcode'],
    for: '',
    residentialType: '',
    topic: '',
    announcementDetails: '',
    areaSize0: '',
    areaSize1: '',
    areaSize: '',
    landSize0: '',
    landSize1: '',
    landSize: '',
    bedroom: '',
    bathroom: '',
    price: '',
    pricePerUnit: '',
    fee: '',
    project: '',
    provinceId: '',
    province: '',
    amphurId: '',
    amphur: '',
    districtId: '',
    district: '',
    address: '',
    street: '',
    zipcode: '',
    googleMap: {
      zoom: 10,
      markers: {
        position: {
          lat: 13.7248946,
          lng: 100.4930246,
        },
        key: 'Bangkok',
        defaultAnimation: 2,
      },
    },
  },
  step1: {},
  step2: {
    requiredField: ['mainImage'],
    mainImage: {},
    images: [],
    deleteImages: [],
  },
  step3: {
    acceptTerms: false,
  },
  sendingData: false,
  sendDataSuccess: '', // yes, no
};

const reducers = (state = initalState, action) => {
  switch (action.type) {
    case 'SELL/STEP/NEXT': return { ...state, step: state.step + 1 };
    case 'SELL/STEP/PREV': return { ...state, step: state.step - 1 };
    case 'SELL/STEP/SAVE': return { ...state, [action.step]: action.data };
    case 'SELL/REQUIREDFIELD/ADD': return {
      ...state,
      step0: {
        ...state.step0,
        requiredField: state.step0.requiredField.includes(action.field) ? state.step0.requiredField : [...state.step0.requiredField, action.field],
      },
    };
    case 'SELL/REQUIREDFIELD/REMOVE': return {
      ...state,
      step0: {
        ...state.step0,
        requiredField: _.filter(state.step0.requiredField, (field) => { return field !== action.field; }),
      },
    };
    case 'SELL/DATA/SENDING': return { ...state, sendingData: action.status };
    case 'SELL/DATA/SEND/SUCCESS': return { ...state, sendDataSuccess: action.status };
    case 'SELL/CLEAR/FORM': return initalState;
    case 'SELL/SET/FORM': return {
      ...state,
      step0: {
        ...state.step0,
        for: action.data.for,
        residentialType: action.data.residentialType,
        topic: action.data.topic,
        announcementDetails: action.data.announceDetails,
        areaSize: action.data.areaSize,
        landSize: '',
        bedroom: action.data.bedroom,
        bathroom: action.data.bathroom,
        price: action.data.price,
        fee: action.data.fee,
        project: action.data.project,
        province: action.data.province,
        amphur: action.data.amphur,
        district: action.data.district,
        address: action.data.address,
        street: action.data.street,
        zipcode: action.data.zipcode,
        googleMap: {
          zoom: 10,
          markers: [{
            position: {
              lat: action.data.location.lat,
              lng: action.data.location.lon,
            },
            key: action.data.province,
            defaultAnimation: 2,
          }],
        },
      },
      step1: {
        ...state.step1,
        specialFeatureView: action.data.tags,
        specialFeatureFacilities: action.data.tags,
        specialFeatureNearbyPlaces: action.data.tags,
        specialFeaturePrivate: action.data.tags,
      },
      step2: {
        ...state.step2,
        mainImage: action.data.mainImage,
        images: action.data.images,
      },
    };
    default:
      return state;
  }
};

export default reducers;
