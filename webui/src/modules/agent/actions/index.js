// import _ from 'lodash';
// import moment from 'moment';
import { createContactAgent } from '../api';

export const initDomain = (domain) => {
  return (dispatch) => {
    dispatch({
      type: 'AGENT/CONTACT/SET/DOMAIN',
      domain,
    });
  };
};

const contactAgentSubmitting = (domain, submitting) => {
  return {
    type: 'AGENT/CONTACT/SUBMITTING',
    domain,
    submitting,
  };
};

const contactAgentSuccess = (domain, sendSuccess) => {
  return {
    type: 'AGENT/CONTACT/SUCCESS',
    domain,
    sendSuccess,
  };
};

export const contactAgent = (domain, name, emailFrom, emailTo, mobile, body, agentId, agentName, propertyUrl, projectName) => {
  return (dispatch) => {
    dispatch(contactAgentSuccess(domain, ''));
    dispatch(contactAgentSubmitting(domain, true));
    createContactAgent(name, emailFrom, emailTo, mobile, body, agentId, agentName, propertyUrl, projectName).then((result) => {
      dispatch(contactAgentSubmitting(domain, false));
      if (result.status === 'success') {
        dispatch(contactAgentSuccess(domain, 'yes'));
      } else {
        dispatch(contactAgentSuccess(domain, 'no'));
      }
    });
  };
};
