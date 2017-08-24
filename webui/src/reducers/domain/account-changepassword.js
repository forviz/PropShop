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

    case 'DOMAIN/ACCOUNT_CHANGEPASSWORD/EDITING': {
      return {
        ...state,
        editing: action.editing,
      };
    }

    case 'DOMAIN/ACCOUNT_CHANGEPASSWORD/EDIT/SUCCESS': {
      return {
        ...state,
        editSuccess: action.editSuccess,
      };
    }

    case 'DOMAIN/ACCOUNT_CHANGEPASSWORD/ERROR': {
      return {
        ...state,
        errorMessage: action.message,
      };
    }

    case 'DOMAIN/ACCOUNT_CHANGEPASSWORD/SET/DATA': {
      return {
        ...state,
        data: {
          ...state.data,
          [action.key]: action.value,
        },
      };
    }

    case 'DOMAIN/ACCOUNT_CHANGEPASSWORD/CLEAR': {
      return initialState;
    }

    default: return state;
  }
};

export default reducers;
