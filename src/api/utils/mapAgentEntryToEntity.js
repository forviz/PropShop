import _ from 'lodash';

export default (entry) => {
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
