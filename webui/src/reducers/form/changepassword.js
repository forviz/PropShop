const initialState = {
  editing: false,
  editSuccess: false,
  errorMessage: '',
  data: {
    password1: {
      value: '',
    },
    password2: {
      value: '',
    },
  },
};

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case 'PASSWORD/EDITING': {
      return {
        ...state,
        editing: action.editing
      }
    }
    case 'PASSWORD/EDIT/SUCCESS': {
      return {
        ...state,
        editSuccess: action.editSuccess
      }
    }
    case 'PASSWORD/ERROR': {
      return {
        ...state,
        errorMessage: action.message
      }
    }
    case 'PASSWORD/SET/DATA': {
      return {
        ...state,
        data: {
          ...state.data,
          [action.key]: action.value
        }
      };
    }
    default: return state;
  }
};

export default reducers;
