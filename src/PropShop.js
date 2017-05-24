import React, { Component } from 'react';
import {
  HashRouter as Router,
  Route
} from 'react-router-dom';

import translations from './translations';
import { IntlReducer as Intl, IntlProvider } from 'react-redux-multilingual';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { reactReduxFirebase, firebaseStateReducer } from 'react-redux-firebase';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';

import Header from './containers/Header';
import Footer from './containers/Footer';

import Home from './pages/Home';
import Realestate from './pages/Realestate';
import Sell from './pages/Sell';
import Agent from './pages/Agent';
import AgentDetail from './pages/AgentDetail';
import Login from './pages/Login';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './Propshop.css';

const loggerMiddleware = createLogger();

const rootReducer = combineReducers({
  firebase: firebaseStateReducer,
  Intl
})

const config = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DATABASEURL,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET
}

const createStoreWithFirebase = compose(
  reactReduxFirebase(config, { userProfile: 'users' }),
)(createStore)

const store = createStoreWithFirebase(
  rootReducer, 
  applyMiddleware(
    loggerMiddleware,
  )
)

const routes = [
  { path: '/',
    exact: true,
    header: Header,
    content: Home,
    footer: Footer,
  },
  { path: '/realestate/:id',
    exact: true,
    header: Header,
    content: Realestate,
    footer: Footer,
  },
  { path: '/sell',
    exact: true,
    header: Header,
    content: Sell,
    footer: Footer,
  },
  { path: '/agent',
    exact: true,
    header: Header,
    content: Agent,
    footer: Footer,
  },
  { path: '/agent/:id',
    exact: true,
    header: Header,
    content: AgentDetail,
    footer: Footer,
  },
  { path: '/login',
    exact: true,
    header: Header,
    content: Login,
  },
]

class PropShop extends Component {
  render() {
    return (
      <Provider store={store} locale='th'>
        <IntlProvider translations={translations}>
          <Router>
            <div className="PropShop">
              {routes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  component={route.header}
                />
              ))}
              <div id="Content">
                {routes.map((route, index) => (
                  <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    component={route.content}
                  />
                ))}
              </div>
              {routes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  component={route.footer}
                />
              ))}
            </div>
          </Router>
        </IntlProvider>
      </Provider>
    );
  }
}

export default PropShop;
