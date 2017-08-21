import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import { reactReduxFirebase } from 'react-redux-firebase';
import { IntlProvider } from 'react-redux-multilingual';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import rootReducer from './reducers';
import translations from './translations';
import MyRouter from './router';

import './Propshop.css';

const loggerMiddleware = createLogger();

// Firebase config
const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DATABASEURL,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
};

// Add redux Firebase to compose
const createStoreWithFirebase = compose(
  reactReduxFirebase(firebaseConfig),
)(createStore);

// Create store with reducers and initial state
const store = createStoreWithFirebase(
  rootReducer,
  applyMiddleware(
    loggerMiddleware,
    thunk,
  ),
);

const BREAKPOINT = 767;

class PropShop extends Component {

  componentWillMount() {
    this.handleResize();
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    const mobileMode = window.matchMedia(`(max-width: ${BREAKPOINT}px)`).matches;
    if (mobileMode !== store.getState().core.mobileMode) {
      store.dispatch({
        type: 'CORE/SET/MOBILE',
        mobileMode,
      });
    }
  }

  render() {
    return (
      <Provider store={store} locale="th">
        <IntlProvider translations={translations}>
          <MyRouter />
        </IntlProvider>
      </Provider>
    );
  }
}

export default PropShop;
