const initialState = {
  contact: {
    submitting: false,
    sendSuccess: '', // yes, no
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {

    case 'AGENT/CONTACT/SET/DOMAIN': {
      return {
        ...state,
        [action.domain]: state,
      };
    }

    case 'AGENT/CONTACT/SUBMITTING': {
      return {
        ...state,
        [action.domain]: {
          contact: {
            ...state.contact,
            submitting: action.submitting,
          },
        },
      };
    }

    case 'AGENT/CONTACT/SUCCESS': {
      return {
        ...state,
        [action.domain]: {
          contact: {
            ...state.contact,
            sendSuccess: action.sendSuccess,
          },
        },
      };
    }

    default: return state;
  }
};

export default reducer;
