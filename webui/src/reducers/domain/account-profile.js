import _ from 'lodash';

const initialState = {
  editing: false,
  editSuccess: false,
  errorMessage: '',
  data: {},
};

const reducers = (state = initialState, action) => {
  switch (action.type) {

    case 'DOMAIN/ACCOUNT_PROFILE/EDITING': {
      return {
        ...state,
        editing: action.editing,
      };
    }

    case 'DOMAIN/ACCOUNT_PROFILE/EDIT_SUCCESS': {
      return {
        ...state,
        editSuccess: action.editSuccess,
      };
    }

    case 'DOMAIN/ACCOUNT_PROFILE/ERROR_MESSAGE': {
      return {
        ...state,
        errorMessage: action.errorMessage,
      };
    }

    case 'DOMAIN/ACCOUNT_PROFILE/RESULT_RECEIVED': {
      return {
        ...state,
        user: action.user,
      };
    }

    case 'DOMAIN/ACCOUNT_PROFILE/SET/DATA': {
      return {
        ...state,
        data: {
          ...state.data,
          [action.key]: action.value,
        },
      };
    }

    case 'DOMAIN/ACCOUNT_PROFILE/SET/FORM': {
      return {
        ...state,
        data: {
          ...state.data,
          email: {
            value: _.get(action.user, 'email.en-US'),
          },
          username: {
            value: _.get(action.user, 'username.en-US'),
          },
          prefixName: {
            value: _.get(action.user, 'prefixName.en-US') ? _.get(action.user, 'prefixName.en-US') : [],
          },
          name: {
            value: _.get(action.user, 'name.en-US'),
          },
          lastname: {
            value: _.get(action.user, 'lastname.en-US'),
          },
          prefixPhone: {
            value: '0',
          },
          phone: {
            value: _.get(action.user, 'phone.en-US'),
          },
          image: {
            value: _.get(action.user, 'image.en-US'),
          },
          rating: {
            value: _.get(action.user, 'rating.en-US'),
          },
          company: {
            value: _.get(action.user, 'company.en-US'),
          },
          specialization: {
            value: _.get(action.user, 'specialization.en-US'),
          },
          licenseNumber: {
            value: _.get(action.user, 'licenseNumber.en-US'),
          },
          about: {
            value: _.get(action.user, 'about.en-US'),
          },
        },
      };
    }
    default: return state;
  }
};

export default reducers;
