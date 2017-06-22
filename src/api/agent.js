import * as contentful from 'contentful';
import _ from 'lodash';

const client = contentful.createClient({
  space: process.env.REACT_APP_SPACE,
  accessToken: process.env.REACT_APP_ACCESSTOKEN,
});

export const getAgentEntry = (agentId) => {
  return client.getEntries({ 'sys.id': agentId }).then((response) => {
    return _.head(response.items);
  });
};

export const getAgentEntries = ({ text, area }) => {
  const query = {
    content_type: 'agent',
    query: text,
    'fields.area': area,
  };

  // Remove empty, null undefined from query;
  const cleanQuery = _.pickBy(query, val => !_.isEmpty(val));
  console.log('clean', cleanQuery);
  return client.getEntries(cleanQuery).then((response) => {
    return response;
  });
};
