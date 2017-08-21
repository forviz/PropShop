import _ from 'lodash';

export default (entry) => {
  return {
    id: _.get(entry, 'sys.id'),
    username: _.get(entry, 'fields.username.en-US'),
    email: _.get(entry, 'fields.email.en-US'),
    prefixName: _.get(entry, 'fields.prefixName.en-US'),
    name: _.get(entry, 'fields.name.en-US'),
    lastname: _.get(entry, 'fields.lastname.en-US'),
    image: _.get(entry, 'fields.image.en-US'),
    rate: {
      rating: _.get(entry, 'fields.rating.en-US'),
      count: 10,
    },
    phone: _.get(entry, 'fields.phone.en-US'),
    company: _.get(entry, 'fields.company.en-US'),
    specialization: _.get(entry, 'fields.specialization.en-US'),
    licenseNumber: _.get(entry, 'fields.licenseNumber.en-US'),
    about: _.get(entry, 'fields.about.en-US'),
    uid: _.get(entry, 'fields.uid.en-US'),
    area: _.get(entry, 'fields.area.en-US'),
    verify: _.get(entry, 'fields.verify') ? _.get(entry, 'fields.verify') : false,
  };
};
