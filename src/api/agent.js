import * as contentful from 'contentful';
import _ from 'lodash';

export const mapAgentEntryToEntitiy = (entry) => {
  return {
    id: _.get(entry, 'sys.id'),
    name: _.get(entry, 'fields.name'),
    lastname: _.get(entry, 'fields.lastname'),
    image: _.get(entry, 'fields.image.fields.file.url'),
    rate: {
      rating: _.get(entry, 'fields.rating'),
      count: 10,
    },
    phone: _.get(entry, 'fields.phone'),
    company: _.get(entry, 'fields.company'),
    specialization: _.get(entry, 'fields.specialization'),
    licenseNumber: _.get(entry, 'fields.licenseNumber'),
    about: _.get(entry, 'fields.about'),
    UID: _.get(entry, 'fields.UID'),
    area: _.get(entry, 'fields.area'),
  };
};

const mapAgentReivewEntryToEntitiy = (entry) => {
  return {
    id: _.get(entry, 'sys.id'),
    createdAt: _.get(entry, 'sys.createdAt'),
    updatedAt: _.get(entry, 'sys.updatedAt'),
    ...entry.fields,
  };
};

const mapPropertyEntryToEntitiy = (entry) => {
  return {
    id: _.get(entry, 'sys.id'),
    createdAt: _.get(entry, 'sys.createdAt'),
    updatedAt: _.get(entry, 'sys.updatedAt'),
    ...entry.fields,
    mainImage: _.get(entry, 'fields.mainImage.fields.file.url'),
    room: {
      bedroom: _.get(entry, 'fields.bedroom', 0),
      bathroom: _.get(entry, 'fields.bathroom', 0),
    },
  };
};

const mapActivityEntryToEntitiy = (entry, includes) => {
  // Add linkEntry to by
  const agentEntry = _.find(includes.Entry, includeEntry => includeEntry.sys.id === entry.fields.by.sys.id);
  return {
    id: _.get(entry, 'sys.id'),
    createdAt: _.get(entry, 'sys.createdAt'),
    updatedAt: _.get(entry, 'sys.updatedAt'),
    ...entry.fields,
    by: _.get(agentEntry, 'fields.name', ''),
  };
};

const client = contentful.createClient({
  space: process.env.REACT_APP_SPACE,
  accessToken: process.env.REACT_APP_ACCESSTOKEN,
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
      items: _.map(response.items, item => mapAgentEntryToEntitiy(item)),
    };
  });
};

export const getAgentEntry = (agentId) => {
  return client.getEntries({ 'sys.id': agentId }).then((response) => {
    return mapAgentEntryToEntitiy(_.head(response.items));
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
      items: _.map(response.items, item => mapAgentReivewEntryToEntitiy(item)),
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
      items: _.map(response.items, item => mapPropertyEntryToEntitiy(item)),
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
        return mapActivityEntryToEntitiy(item, includes);
      }),
    };
  });
};
