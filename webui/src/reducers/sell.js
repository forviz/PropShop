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
      markers: [{
        position: {
          lat: 13.7248946,
          lng: 100.4930246,
        },
        key: 'Bangkok',
        defaultAnimation: 2,
      }],
    },
  },
  step1: {},
  step2: {
    requiredField: ['mainImage'],
    mainImage: {},
    images: [],
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
    default:
      return state;
  }
};

export default reducers;
