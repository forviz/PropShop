const initialState = {
  editing: false,
  editSuccess: false,
  errorMessage: '',
  user: {},
  data: {},
};

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case 'PROFILE/EDITING': {
      return {
        ...state,
        editing: action.editing
      }
    }
    case 'PROFILE/EDIT/SUCCESS': {
      return {
        ...state,
        editSuccess: action.editSuccess
      }
    }
    case 'PROFILE/SET/USER': {
      return {
        ...state,
        user: action.user
      };
    }
    case 'PROFILE/SET/DATA': {
      return {
        ...state,
        data: {
          ...state.data,
          [action.key]: action.value
        }
      };
    }
    case 'PROFILE/SET/FORM': {
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
            value: action.user.phone ? action.user.phone.slice(1) : '',
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
          password1: {
            value: '',
          },
          password2: {
            value: '',
          },
        },
      };
    }
    default: return state;
  }
};

export default reducers;
