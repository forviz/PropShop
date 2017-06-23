import _ from 'lodash';

export default (entry) => {
  return {
    id: _.get(entry, 'sys.id'),
    createdAt: _.get(entry, 'sys.createdAt'),
    updatedAt: _.get(entry, 'sys.updatedAt'),
    ...entry.fields,
  };
};
