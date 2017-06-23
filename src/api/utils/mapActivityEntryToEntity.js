import _ from 'lodash';

export default (entry, includes) => {
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
