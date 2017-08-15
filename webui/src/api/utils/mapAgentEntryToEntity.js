import _ from 'lodash';

export default (entry) => {
  return {
    id: _.get(entry, 'sys.id'),
    username: _.get(entry, 'fields.username'),
    email: _.get(entry, 'fields.email'),
    prefixName: _.get(entry, 'fields.prefixName'),
    name: _.get(entry, 'fields.name'),
    lastname: _.get(entry, 'fields.lastname'),
    image: _.get(entry, 'fields.image'),
    rate: {
      rating: _.get(entry, 'fields.rating'),
      count: 10,
    },
    phone: _.get(entry, 'fields.phone'),
    company: _.get(entry, 'fields.company'),
    specialization: _.get(entry, 'fields.specialization'),
    licenseNumber: _.get(entry, 'fields.licenseNumber'),
    about: _.get(entry, 'fields.about'),
    uid: _.get(entry, 'fields.uid'),
    area: _.get(entry, 'fields.area'),
    verify: _.get(entry, 'fields.verify') ? _.get(entry, 'fields.verify') : false,
  };
};
