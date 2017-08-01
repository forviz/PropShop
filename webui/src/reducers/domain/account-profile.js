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
            value: action.user.email,
          },
          username: {
            value: action.user.username,
          },
          prefixName: {
            value: action.user.prefixName ? action.user.prefixName : [],
          },
          name: {
            value: action.user.name,
          },
          lastname: {
            value: action.user.lastname,
          },
          prefixPhone: {
            value: '0',
          },
          phone: {
            value: action.user.phone,
          },
          image: {
            value: action.user.image,
          },
          rating: {
            value: action.user.rating,
          },
          company: {
            value: action.user.company,
          },
          specialization: {
            value: action.user.specialization,
          },
          licenseNumber: {
            value: action.user.licenseNumber,
          },
          about: {
            value: action.user.about,
          },
        },
      };
    }
    default: return state;
  }
};

export default reducers;
