import _ from 'lodash';

export default (entry) => {
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
