import * as contentful from 'contentful';
import * as contentfulManagement from 'contentful-management';
import _ from 'lodash';

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_ACCESSTOKEN,
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: 0,
  },
});

const clientManagement = contentfulManagement.createClient({
  accessToken: process.env.CONTENTFUL_ACCESSTOKEN_MANAGEMENT,
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: 0,
  },
});

export const checkStackWishlist = async (userId, propertyId) => {
  const entries = await client.getEntries({
    content_type: 'wishList',
    'fields.propertyId.sys.id': propertyId,
    'fields.guestId': userId,
  });
  return !_.isEmpty(entries.items);
};

export const mapEntryWishlist = (entry) => {
  const items = [];
  _.map(entry.items, (data) => {
    const property = data.fields.propertyId;
    const { forSale } = property.fields;
    items.push({
      imageUrl: _.get(property, 'fields.images[0].fields.file.url'),
      name: _.get(property, 'fields.name'),
      description: _.get(property, 'fields.description'),
      type: forSale ? _.get(property, 'fields.priceSale.type') : _.get(property, 'fields.priceRent.type'),
      attributes: _.get(property, 'fields.attributes'),
      area: _.get(property, 'fields.areaUsable'),
      price: forSale ? _.get(property, 'fields.priceSale') : _.get(property, 'fields.priceRent'),
      amphur: _.get(property, 'fields.amphur'),
      province: _.get(property, 'fields.province'),
      propertyType: _.get(property, 'fields.propertyType'),
      id: _.get(property, 'sys.id'),
      entryId: data.sys.id,
    });
  });
  return items;
};

export const createWishlist = async (req, res) => {
  try {
    const { userId, propertyId } = req.body;
    const space = await clientManagement.getSpace(process.env.CONTENTFUL_SPACE);
    const stack = await checkStackWishlist(userId, propertyId);
    console.log('checkStackWishlist', stack);

    if (!stack) {
      const entry = await space.createEntry('wishList', {
        fields: {
          propertyId: {
            'en-US': {
              sys: {
                id: propertyId,
                linkType: 'Entry',
                type: 'Link',
              },
            },
          },
          guestId: { 
            'en-US': userId,
          },
        },
      });
      const entryPublish = await entry.publish();
      res.json({
        status: 'SUCCESS',
        data: entryPublish,
      });
    } else {
      res.status(400).json({
        status: 'ERROR',
        message: 'Item Stack',
      });
    }
  } catch (e) {
    res.status(500).json({
      status: 'ERROR',
      message: JSON.parse(e.message),
    });
  }
};

export const updateWishlist = async (req, res) => {
  try {
    const { guestId, userId } = req.body;
    const space = await clientManagement.getSpace(process.env.CONTENTFUL_SPACE);

    const entries = await client.getEntries({
      content_type: 'wishList',
      'fields.guestId': guestId,
    });
    _.map(entries.items, async (item) => {
      const entry = await space.getEntry(item.sys.id);
      entry.fields.guestId['en-US'] = await userId;
      const entryUpdated = await entry.update();
      const entryPublished = await entryUpdated.publish();
    });

    res.json({
      status: 'UPDATE SUCCESS',
    });
  } catch (e) {
    res.status(500).json({
      status: 'ERROR',
      message: JSON.parse(e.message),
    });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    const entries = await client.getEntries({
      content_type: 'wishList',
      'fields.guestId': id,
      order: 'sys.createdAt',
    });
    res.json({
      status: 'SUCCESS',
      data: mapEntryWishlist(entries),
    });
  } catch (e) {
    res.status(500).json({
      status: 'ERROR',
      message: JSON.parse(e.message),
    });
  }
};

export const deleteEntry = async (entryId) => {
  const space = await clientManagement.getSpace(process.env.CONTENTFUL_SPACE);
  const entry = await space.getEntry(entryId);
  await entry.unpublish();
  await entry.delete();
};

export const deleteWishlist = async (req, res) => {
  try {
    const { userId, propertyId } = req.body;
    const entry = await client.getEntries({
      content_type: 'wishList',
      'fields.propertyId.sys.id': propertyId,
      'fields.guestId': userId,
    });
    // await deleteEntry(entry.items[0].sys.id);
    _.map(entry.items, (item) => {
      deleteEntry(item.sys.id);
    });

    res.json({
      status: 'DELETE SUCCESS',
    });
  } catch (e) {
    res.status(500).json({
      status: 'ERROR',
      message: JSON.parse(e.message),
    });
  }
};

export const getUserWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    const { skip, limit } = req.query;

    const queryParams = _.omitBy({
      content_type: 'wishList',
      'fields.guestId': id,
      order: '-sys.updatedAt',
      skip,
      limit,
    }, val => val === undefined || val === '' || val === false);

    const result = await client.getEntries(queryParams);
    res.json({
      data: result,
    });
  } catch (e) {
    res.status(500).json({
      status: '500',
      code: 'Internal Server Error',
      title: e.message,
    });
  }
};
