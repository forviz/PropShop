import * as contentful from 'contentful';
import * as contentfulManagement from 'contentful-management';
import _ from 'lodash';

const client = contentful.createClient({
  space: process.env.REACT_APP_SPACE,
  accessToken: process.env.REACT_APP_ACCESSTOKEN,
});

const clientManagement = contentfulManagement.createClient({
  accessToken: process.env.REACT_APP_ACCESSTOKEN_MANAGEMENT,
});

export const fetchCreateWishlist = (userId, propertyId) => {
  console.log('fetchCreateWishlist',userId,propertyId)
  clientManagement.getSpace(process.env.REACT_APP_SPACE)
  .then(space => space.createEntry('wishList', {
    fields: {
      userId: {
        'en-US': {
          sys: {
            id: userId,
            linkType: 'Entry',
            type: 'Link',
          },
        },
      },
      propertyId: {
        'en-US': {
          sys: {
            id: propertyId,
            linkType: 'Entry',
            type: 'Link',
          },
        },
      },
    },
  }))
  .then((entry) => {
    entry.publish();
    return entry;
  })
  .catch(console.error);
};

export const fetchGetWishlist = (userId) => {
  console.log('fetchGetWishlist ',userId)
  return client.getEntries({
    content_type: 'wishList',
    'fields.userId.sys.id': userId,
    // 'fields.userId.fields.uid': uid,
  })
  .then((entry) => {
    const items = [];
    _.map(entry.items, (data) => {
      const property = data.fields.propertyId;
      const { forSale } = property.fields;
      items.push({
        imageUrl: _.get(property,'fields.images[0].fields.file.url'),
        name: _.get(property,'fields.name'),
        description: _.get(property,'fields.description'),
        type: forSale ? _.get(property,'fields.priceSale.type') : _.get(property,'fields.priceRent.type'),
        attributes: _.get(property,'fields.attributes'),
        area: _.get(property,'fields.areaUsable'),
        price: forSale ? _.get(property,'fields.priceSale') : _.get(property,'fields.priceRent'),
        id: _.get(property,'sys.id'),
        entryId: data.sys.id,
      });
    });
    return items;
  })
  .catch(console.error);
};

export const deleteEntry = (entryId) => {
  return clientManagement.getSpace(process.env.REACT_APP_SPACE)
  .then((space) => space.getEntry(entryId))
  .then((entry) => {
    entry.delete();
  })
  .then(() => console.log('Entry deleted.'))
  .catch(console.error);
};

export const fetchDeleteWishlist = (entryId) => {
  return clientManagement.getSpace(process.env.REACT_APP_SPACE)
  .then((space) => space.getEntry(entryId))
  .then((entry) => {
    entry.unpublish();
  })
  .then(() => deleteEntry(entryId))
  .catch(console.error);
};

