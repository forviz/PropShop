const initalState = {
  mobileMode: false,
};

const reducers = (state = initalState, action) => {
  switch (action.type) {
    case 'CORE/SET/MOBILE': {
      return {
        ...state,
        mobileMode: action.mobileMode,
      };
    }
    default:
      return state;
  }
};

export default reducers;
