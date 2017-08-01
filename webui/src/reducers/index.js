import { combineReducers } from 'redux';
import { firebaseStateReducer } from 'react-redux-firebase';
import { IntlReducer as Intl } from 'react-redux-multilingual';
import user from './user';
import config from './config';
import banners from './banners';
import realestates from './realestates';
import sell from './sell';

// Entities
import areas from './entities/areas';
// import agents from './entities/agents';
import references from './entities/references';
import activities from './entities/activities';
import news from './entities/news';

// modules
import properties from '../modules/property';
import agents from '../modules/agent';

// Domain
import propertySearch from './domain/property-search';
import agentSearch from './domain/agent-search';
import accountProperty from './domain/account-property';
import accountChangepassword from './domain/account-changepassword';
import accountProfile from './domain/account-profile';
import accountWishlist from './domain/account-wishlist';

export default combineReducers({
  Intl,
  config,
  user,
  banners,
  realestates,
  sell,
  entities: combineReducers({
    areas,
    properties,
    agents,
    references,
    activities,
    news,
  }),
  domain: combineReducers({
    agentSearch,
    propertySearch,
    accountWishlist,
    accountProperty,
    accountChangepassword,
    accountProfile,
  }),
  firebase: firebaseStateReducer,
});
