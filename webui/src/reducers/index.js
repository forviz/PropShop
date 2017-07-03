import { combineReducers } from 'redux';
import { IntlReducer as Intl } from 'react-redux-multilingual';
import user from './user';
import config from './config';
import banners from './banners';
import realestates from './realestates';
import sell from './sell';

// Entities
import properties from './entities/properties';
import agents from './entities/agents';
import references from './entities/references';
import activities from './entities/activities';

// Domain
import agentSearch from './domain/agent-search';

// Form
import profile from './form/profile';
import changepassword from './form/changepassword';

export default combineReducers({
  Intl,
  config,
  user,
  banners,
  realestates,
  sell,
  entities: combineReducers({
    properties,
    agents,
    references,
    activities,
  }),
  domain: combineReducers({
    agentSearch,
  }),
  form: combineReducers({
    profile,
    changepassword,
  }),
});
