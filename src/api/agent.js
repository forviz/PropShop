import * as contentful from 'contentful';
import * as contentfulManagement from 'contentful-management';
import _ from 'lodash';

// Content Mapper
import mapAgentEntryToEntity from './utils/mapAgentEntryToEntity';
import mapActivityEntryToEntity from './utils/mapActivityEntryToEntity';
import mapReferenceEntryToEntity from './utils/mapReferenceEntryToEntity';
import mapPropertyEntryToEntity from './utils/mapPropertyEntryToEntity';

const client = contentful.createClient({
  space: process.env.REACT_APP_SPACE,
  accessToken: process.env.REACT_APP_ACCESSTOKEN,
});

const clientManagement = contentfulManagement.createClient({
  accessToken: process.env.REACT_APP_ACCESSTOKEN_MANAGEMENT,
});

export const getAgentEntries = ({ text, area }) => {
  const query = {
    content_type: 'agent',
    query: text,
    'fields.area': area,
  };

  // Remove empty, null undefined from query;
  const cleanQuery = _.pickBy(query, val => !_.isEmpty(val));
  return client.getEntries(cleanQuery).then((response) => {
    return {
      ...response,
      items: _.map(response.items, item => mapAgentEntryToEntity(item)),
    };
  });
};

export const getAgentEntry = (agentId) => {
  return client.getEntries({ 'sys.id': agentId }).then((response) => {
    return mapAgentEntryToEntity(_.head(response.items));
  });
};

export const getAgentReferences = (agentId) => {
  return client.getEntries({
    content_type: 'references',
    'fields.forAgent.sys.id': agentId,
  })
  .then((response) => {
    return {
      ...response,
      items: _.map(response.items, item => mapReferenceEntryToEntity(item)),
    };
  });
};

export const getAgentProperties = (agentId) => {
  return client.getEntries({
    content_type: 'realEstate',
    'fields.agents.sys.id[in]': agentId,
  })
  .then((response) => {
    return {
      ...response,
      items: _.map(response.items, item => mapPropertyEntryToEntity(item)),
    };
  });
};

export const getAgentActivities = (agentId) => {
  return client.getEntries({
    content_type: 'activity',
    'fields.by.sys.id': agentId,
    include: 1,
  })
  .then((response) => {
    const includes = response.includes;
    return {
      ...response,
      items: _.map(response.items, (item) => {
        return mapActivityEntryToEntity(item, includes);
      }),
    };
  });
};


export const contactAgent = (name, email, mobile, body) => {
  return clientManagement.getSpace(process.env.REACT_APP_SPACE)
  .then(space => space.createEntry('contact', {
    fields: {
      contactName: {
        'en-US': name,
      },
      contactEmail: {
        'en-US': email,
      },
      contactMobile: {
        'en-US': mobile,
      },
      body: {
        'en-US': body,
      },
    },
  }))
  .then(entry => entry.publish())
  .catch(console.error);
}
