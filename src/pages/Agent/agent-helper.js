import _ from 'lodash';

export const mapEntryToAgent = (entity) => {
  return {
    id: _.get(entity, 'sys.id'),
    name: _.get(entity, 'fields.name'),
    lastname: _.get(entity, 'fields.lastname'),
    image: _.get(entity, 'fields.image.fields.file.url'),
    rate: {
      rating: _.get(entity, 'fields.rating'),
      count: 10,
    },
    phone: _.get(entity, 'fields.phone'),
    company: _.get(entity, 'fields.company'),
    specialization: _.get(entity, 'fields.specialization'),
    licenseNumber: _.get(entity, 'fields.licenseNumber'),
    about: _.get(entity, 'fields.about'),
    UID: _.get(entity, 'fields.UID'),
    area: _.get(entity, 'fields.area'),
    comments: [],
    properties: [],
    activities: [],
  }
}
