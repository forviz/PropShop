import * as contentful from 'contentful';
import * as contentfulManagement from 'contentful-management';
import moment from 'moment';
import _ from 'lodash';

import mapAgentEntryToEntity from './utils/mapAgentEntryToEntity';

const client = contentful.createClient({
  space: process.env.REACT_APP_SPACE,
  accessToken: process.env.REACT_APP_ACCESSTOKEN,
});

const clientManagement = contentfulManagement.createClient({
  accessToken: process.env.REACT_APP_ACCESSTOKEN_MANAGEMENT,
});

const mapContentFulRealestateToMyField = (data) => {
  return _.reduce(data, (acc, elem, index) => {
    const inWebsite = moment.duration(moment(new Date()).diff(moment(elem.sys.createdAt))).days() === 0;
    return {
      ...acc,
      [index]: {
        ...elem.fields,
        id: elem.sys.id,
        createdAt: elem.sys.createdAt,
        updatedAt: elem.sys.updatedAt,
        mainImage: elem.fields.mainImage.fields.file.url,
        images: _.map(elem.fields.images, (image) => {
          return image.fields.file.url;
        }),
        price: elem.fields.price,
        // agentId: elem.fields.agent ? elem.fields.agent.sys.id : '',
        agent: elem.fields.agents ? elem.fields.agents[0].fields : '',
        inWebsite: inWebsite === 0 ? 1 : inWebsite,
        lastUpdate: `${moment(elem.sys.updatedAt).format('D/MM/YYYY H:mm A')}:`,
      },
    };
  }, {});
};

const convertBanner = (entry, string) => {
  let datas = {};
  let i;
  for (i = 0; i < 5; i++) {
    const row = string+(i+1).toString();
    if (entry.items[0].fields[row]) {
      const items = entry.items[0].fields[row];
      const data = mapContentFulRealestateToMyField(items);
      datas[i] = data;
    }
  }
  return datas;
};

const mapContentFulBannerToMyField = (entry) => {
  return {
    main: _.map(mapContentFulRealestateToMyField(entry.items[0].fields.main), main => main),
    condo: convertBanner(entry, 'condoRow'),
    house: convertBanner(entry, 'houseRow'),
  };
};

const getConfigSpecialFeature = (contentType) => {
  let specialFeature = _.filter(contentType.fields, (item) => {
    return item.id === 'specialFeatureView'
           || item.id === 'specialFeatureFacilities'
           || item.id === 'specialFeatureNearbyPlaces'
           || item.id === 'specialFeaturePrivate';
  });
  specialFeature = _.reduce(specialFeature, (acc, elem) => {
    return {
      ...acc,
      [elem.id]: {
        name: elem.name,
        data: elem.items.validations[0].in,
      },
    };
  }, {});
  return specialFeature;
};

// const getConfigFor = (contentType) => {
//   const _for = _.find(contentType.fields, (item) => {
//     return item.id === 'for';
//   });
//   return _for.items.validations[0].in;
// }

async function getConfigPriceOrder(order) {
  const results = await client.getEntries({
    content_type: 'realEstate',
    order: order === 'max' ? '-fields.price' : 'fields.price',
    limit: 1,
  });
  return results.items[0].fields.price;
}

// async function getRoomOrder(room, order) {
//   const results = await client.getEntries({
//     content_type: 'realEstate',
//     order: order === 'max' ? `-fields.${room}` : `fields.${room}`,
//     limit: 1,
//   });
//   return results.items[0].fields[room];
// }

async function mapConfigRealEstate() {
  const contentType = await client.getContentType('realEstate');
  const data = {
    specialFeature: getConfigSpecialFeature(contentType),
    // for: getConfigFor(contentType),
    priceMin: await getConfigPriceOrder('min'),
    priceMax: await getConfigPriceOrder('max'),
    // bedroom: await getRoomOrder('bedroom','max'),
    // bathroom: await getRoomOrder('bathroom','max'),
  };
  return data;
}

export const getBannerRealEstate = () => {
  return client.getEntries({
    'sys.id': process.env.REACT_APP_CONTENTFUL_BANNER,
    include: 1,
  }).then((entry) => {
    return mapContentFulBannerToMyField(entry);
  });
};

export const getConfigRealEstate = () => {
  return mapConfigRealEstate();
};

export const getRealEstate = (search) => {
  const searchEntries = {};
  searchEntries.content_type = 'realEstate';
  if (search.id) searchEntries['sys.id'] = search.id;
  if (search.for) searchEntries['fields.for[in]'] = search.for;
  if (search.query) searchEntries.query = search.query;
  if (search.residentialType) searchEntries['fields.residentialType'] = search.residentialType;
  if (search.bedroom) searchEntries['fields.bedroom'] = parseInt(search.bedroom, 10);
  if (search.bathroom) searchEntries['fields.bathroom'] = parseInt(search.bathroom, 10);
  if (search.priceMin) searchEntries['fields.price[gte]'] = parseInt(search.priceMin, 10);
  if (search.priceMax) searchEntries['fields.price[lte]'] = parseInt(search.priceMax, 10);
  if (search.specialFeatureView) searchEntries['fields.specialFeatureView[all]'] = search.specialFeatureView;
  if (search.specialFeatureFacilities) searchEntries['fields.specialFeatureFacilities[all]'] = search.specialFeatureFacilities;
  if (search.specialFeatureNearbyPlaces) searchEntries['fields.specialFeatureNearbyPlaces[all]'] = search.specialFeatureNearbyPlaces;
  if (search.specialFeaturePrivate) searchEntries['fields.specialFeaturePrivate[all]'] = search.specialFeaturePrivate;
  if (search.location) searchEntries['fields.location[within]'] = `${search.location},10`;
  if (_.size(searchEntries)) {
    return false;
  }
  return client.getEntries(searchEntries).then((entry) => {
    return _.map(mapContentFulRealestateToMyField(entry.items), item => item);
  });
  // 'fields.for[in]': 'Sell'
  // 'fields.residentialType': 'House',
  // 'fields.bedroom': 1,
  // 'fields.bathroom': 1,
  // 'fields.address[match]': 'เชียงใหม่',
  // 'fields.project[match]': 'เชียงใหม่',
  // 'query': 'บางนา',
  // 'fields.price[gte]': 0,
  // 'fields.price[lte]': 300000000,
  // 'fields.specialFeatureView[all]': 'วิวทะเล'
};

const existUser = (uid) => {
  return client.getEntries({
    content_type: 'agent',
    'fields.uid': uid,
  })
  .then((response) => {
    return response.total === 0 ? false : true;
  })
  .catch(console.error);
};

export const publishEntry = (entryId) => {
  return clientManagement.getSpace(process.env.REACT_APP_SPACE)
  .then(space => space.getEntry(entryId))
  .then(entry => entry.publish())
  .then((entry) => {
    return entry;
  })
  .catch(console.error);
};

export const createUser = (user) => {
  return existUser(user.uid).then((hasUser) => {
    if (!hasUser) {
      return clientManagement.getSpace(process.env.REACT_APP_SPACE)
      .then(space => space.createEntry('agent', {
        fields: {
          username: {
            'en-US': user.displayName,
          },
          email: {
            'en-US': user.email,
          },
          uid: {
            'en-US': user.uid,
          },
        },
      }))
      .then((entry) => {
        return publishEntry(entry.sys.id);
      })
      .catch(console.error);
    }
  });
};

const parseRealEstateData = (data, mainImageId, imageIds) => {
  return {
    topic: _.get(data, 'step0.topic'),
    detail: _.get(data, 'step0.announcementDetails'),
    for: _.get(data, 'step0.for'),
    price: _.toNumber(_.get(data, 'step0.price')),
    agent: {
      id: 802,
      name: 'James Bond',
      email: 'jamesbond@agent.com',
      phone: '09xxxxxxx'
    },
    property: {
      id: undefined,
      residentialType: _.get(data, 'step0.residentialType'),
      usableArea: {
        size: 36,
        description: _.toString(_.get(data, 'step0.areaSize')),
        unit: 'm',
      },
      landArea: {
        size: 60,
        description: _.toString(_.get(data, 'step0.landSize')),
        unit: 'm',
      },
      bedroom: _.get(data, 'step0.bedroom'),
      bathroom: _.get(data, 'step0.bathroom'),
      price: _.toNumber(_.get(data, 'step0.price')),
      fee: _.toNumber(_.get(data, 'step0.fee')),
      project: {},
      location: {
        addressText: '',
        areaIds: [],
        lat: _.get(data, 'step0.googleMap.markers[0].position.lat'),
        lng: _.get(data, 'step0.googleMap.markers[0].position.lng'),
        zipcode: _.get(data, 'step0.zipcode'),
        province: _.get(data, 'step0.province'),
        amphur: _.get(data, 'step0.amphur'),
        district: _.get(data, 'step0.district'),
        street: _.get(data, 'step0.street'),
      },
      features: [],
      images: _.map(imageIds, imgId => ({ id: imgId, caption: '', albumCover: (mainImageId === imgId) })),
    },
  };
};

export async function createRealEstate(data, user) {
  const assetsMainImage = await uploadFile(data.step2.mainImage.name, data.step2.mainImage.type, data.step2.mainImage);

  let imageData = {};
  let imageIds = [];

  await Promise.all(data.step2.images.map(async (image) => {
    let assetsImages = await uploadFile(image.name, image.type, image);
    imageIds.push(assetsImages.sys.id);
  }));

//   const realEstateFields = parseRealEstateData(data, assetsMainImage.sys.id, imageIds);
//
//   return clientManagement.getSpace(process.env.REACT_APP_SPACE)
//   .then((space) => {
//     space.createEntry('realEstate', {
//       fields: realEstateFields,
//     })
//     .then((entry) => {
//       return entry;
//     })
//     .catch(console.error)
//   });
// }

  return clientManagement.getSpace(process.env.REACT_APP_SPACE)
  .then((space) => space.createEntry('realEstate', {
    fields: {
      for: {
        'en-US': data.step0.for,
      },
      residentialType: {
        'en-US': data.step0.residentialType,
      },
      topic: {
        'en-US': data.step0.topic,
      },
      announcementDetails: {
        'en-US': data.step0.announcementDetails,
      },
      areaSize: {
        'en-US': data.step0.areaSize.toString(),
      },
      landSize: {
        'en-US': data.step0.landSize.toString(),
      },
      bedroom: {
        'en-US': parseInt(data.step0.bedroom, 10),
      },
      bathroom: {
        'en-US': parseInt(data.step0.bathroom, 10),
      },
      price: {
        'en-US': parseInt(data.step0.price, 10),
      },
      fee: {
        'en-US': parseInt(data.step0.fee, 10),
      },
      project: {
        'en-US': data.step0.project,
      },
      province: {
        'en-US': data.step0.province,
      },
      amphur: {
        'en-US': data.step0.amphur,
      },
      district: {
        'en-US': data.step0.district,
      },
      address: {
        'en-US': data.step0.address,
      },
      street: {
        'en-US': data.step0.street,
      },
      zipcode: {
        'en-US': data.step0.zipcode,
      },
      location: {
        'en-US': {
          lat: data.step0.googleMap.markers[0].position.lat,
          lon: data.step0.googleMap.markers[0].position.lng,
        },
      },
      specialFeatureView: {
        'en-US': data.step1.specialFeatureView,
      },
      specialFeatureFacilities: {
        'en-US': data.step1.specialFeatureFacilities,
      },
      specialFeatureNearbyPlaces: {
        'en-US': data.step1.specialFeatureNearbyPlaces,
      },
      mainImage: {
        'en-US': {
          'sys': {
            'id': assetsMainImage.sys.id,
            'linkType': 'Asset',
            'type': 'Link',
          }
        }
      },
      images: {
        'en-US': imageIds
      },
      sold: {
        'en-US': false,
      },
      agent: {
        'en-US': {
          'sys': {
            id: user.id,
            linkType: "Entry",
            type: "Link"
          },
        }
      },
    }
  }))
  .then((entry) => {
    return entry;
  })
  .catch(console.error)
};


// export const uploadFile = (fileName = '', fileType = '', file = '') => {

//   // let fileData = {};

//   // fileData = {
//   //   fields: {
//   //     title: {
//   //       'en-US': fileName
//   //     },
//   //     file: {
//   //       'en-US': {
//   //         contentType: fileType,
//   //         fileName: fileName,
//   //         file: file,
//   //       }
//   //     }
//   //   }
//   // }

//   // var url = 'https://upload.contentful.com/spaces/zucfr6asi8cw/uploads';
//   // var http = new XMLHttpRequest();
//   // http.open("POST", url, false);
//   // http.setRequestHeader("Authorization", "Bearer CFPAT-1f98c3e4470c5caa062451381609936bf1e020ad33f3da2af710a97a4900c5d5");
//   // http.setRequestHeader("Content-Type", "application/octet-stream");
//   // http.send(JSON.stringify(fileData));
//   // console.log('http 1',http);
//   // var result = JSON.parse(http.responseText);

//   // fileData = {
//   //   fields: {
//   //     title: {
//   //       'en-US': fileName
//   //     },
//   //     file: {
//   //       'en-US': {
//   //         contentType: fileType,
//   //         fileName: fileName,
//   //         "uploadFrom":{
//   //           "sys":{
//   //             "type":"Link",
//   //             "linkType":"Upload",
//   //             "id":result.sys.id
//   //           }
//   //         }
//   //       }
//   //     }
//   //   }
//   // }

//   // var url = 'https://api.contentful.com/spaces/zucfr6asi8cw/assets';
//   // var http = new XMLHttpRequest();
//   // http.open("POST", url, false);
//   // http.setRequestHeader("Authorization", "Bearer CFPAT-1f98c3e4470c5caa062451381609936bf1e020ad33f3da2af710a97a4900c5d5");
//   // http.setRequestHeader("Content-Type", "application/vnd.contentful.management.v1+json");
//   // http.send(JSON.stringify(fileData));
//   // var result = JSON.parse(http.responseText);
//   // console.log('http 2',http);

//   // var url = 'https://api.contentful.com/spaces/zucfr6asi8cw/assets/'+result.sys.id+'/files/en-US/process';
//   // var http = new XMLHttpRequest();
//   // http.open("PUT", url, false);
//   // http.setRequestHeader("Authorization", "Bearer CFPAT-1f98c3e4470c5caa062451381609936bf1e020ad33f3da2af710a97a4900c5d5");
//   // http.setRequestHeader("Content-Type", "application/vnd.contentful.management.v1+json");
//   // http.send(null);
//   // console.log('http 3',http);

//   // var url = 'https://api.contentful.com/spaces/zucfr6asi8cw/assets/'+result.sys.id+'/published';
//   // var http = new XMLHttpRequest();
//   // http.open("PUT", url, false);
//   // http.setRequestHeader("Authorization", "Bearer CFPAT-1f98c3e4470c5caa062451381609936bf1e020ad33f3da2af710a97a4900c5d5");
//   // http.setRequestHeader("Content-Type", "application/vnd.contentful.management.v1+json");
//   // http.send(null);
//   // console.log('http 4',http);



//   // return;

//   // clientManagement.getSpace(process.env.REACT_APP_SPACE)
//   // .then((space) => space.createAsset({
//   //     fields: {
//   //         title: {
//   //             'en-US': 'Playsam Streamliner'
//   //         },
//   //         file: {
//   //             'en-US': {
//   //             contentType: 'image/png',
//   //             fileName: 'mthai_photo_editor-364.png',
//   //             upload: logo
//   //             }
//   //         }
//   //     }
//   // }))
//   // .then((asset) => asset.processForAllLocales())
//   // .then((asset) => asset.publish())
//   // .catch(console.error)

//   // return;

//   return clientManagement.getSpace(process.env.REACT_APP_SPACE)
//   .then((space) => space.createAssetFromFiles({
//     fields: {
//       title: {
//         'en-US': fileName
//       },
//       file: {
//         'en-US': {
//           contentType: 'application/octet-stream',
//           fileName: fileName,
//           file: file,
//         }
//       }
//     }
//   }))
//   .then((asset) => asset.processForAllLocales())
//   .then((asset) => asset.publish())
//   .catch(console.error)
// }


export async function uploadFile(fileName = '', fileType = '', file = '') {
  return await clientManagement.getSpace(process.env.REACT_APP_SPACE)
  .then(space => space.createAssetFromFiles({
    fields: {
      title: {
        'en-US': fileName
      },
      file: {
        'en-US': {
          contentType: 'application/octet-stream',
          fileName: fileName,
          file: file,
        }
      }
    }
  }))
  .then(asset => asset.processForAllLocales())
  .then(asset => asset.publish())
  .catch(console.error)
}

export const deleteEntries = async (id) => {
  await clientManagement.getSpace(process.env.REACT_APP_SPACE)
  .then((space) => space.getEntry(id))
  .then((entry) => entry.delete())
  .then(() => console.log('Entry deleted.'))
  .catch(console.error)
}

export const deleteAsset = async (id) => {
  await clientManagement.getSpace(process.env.REACT_APP_SPACE)
  .then((space) => space.getAsset(id))
  .then((asset) => asset.delete())
  .then(() => console.log('Asset deleted.'))
  .catch(console.error)
}

export const unpublishAsset = async (id) => {
  await clientManagement.getSpace(process.env.REACT_APP_SPACE)
  .then((space) => space.getAsset(id))
  .then((asset) => asset.unpublish())
  .then((asset) => console.log(`Asset ${asset.sys.id} unpublished.`))
  .catch(console.error)
}

export const deleteOldAsset = async (id) => {
  await unpublishAsset(id);
  await deleteAsset(id);
}

export const getUserData = (uid) => {
  return client.getEntries({
    content_type: 'agent',
    'fields.uid': uid
  })
  .then((response) => {
    return mapAgentEntryToEntity(response.items[0]);
  })
  .catch(console.error)
}

const mapFieldAgent = (data) => {
  return _.reduce(data, (acc, elem, index) => {
    return {
      ...acc,
      [index]: {
        ...elem.fields,
        id: elem.sys.id,
        createdAt: elem.sys.createdAt,
        updatedAt: elem.sys.updatedAt,
        name: elem.fields.name ? elem.fields.name : '',
        lastname: elem.fields.lastname ? elem.fields.lastname : '',
        image: elem.fields.image ? elem.fields.image.fields.file.url : '',
        rating: elem.fields.rating ? elem.fields.rating : '',
        phone: elem.fields.phone ? elem.fields.phone : '',
        company: elem.fields.company ? elem.fields.company : '',
        specialization: elem.fields.specialization ? elem.fields.specialization : '',
        licenseNumber: elem.fields.licenseNumber ? elem.fields.licenseNumber : '',
        about: elem.fields.about ? elem.fields.about : '',
      },
    }
  }, {});
}

export const updateAgent = async (id, data) => {

  let image;
  if (data.image.newImage) {
    image = await uploadFile(data.image.newImage.name, data.image.newImage.type, data.image.newImage);
    if (image) {
      await deleteOldAsset(data.image.sys.id);
    }
  }

  return clientManagement.getSpace(process.env.REACT_APP_SPACE)
  .then((space) => space.getEntry(id))
  .then((entry) => {
    const fields = {
      email: {
        'en-US': data.email
      },
      image: {
        'en-US': {
          'sys': {
            'id': image ? image.sys.id : data.image.sys.id,
            'linkType': 'Asset',
            'type': 'Link',
          }
        }
      },
      username: {
        'en-US': data.username
      },
      prefixName: {
        'en-US': data.prefixName
      },
      name: {
        'en-US': data.name
      },
      lastname: {
        'en-US': data.lastname
      },
      phone: {
        'en-US': data.prefixPhone+data.phone
      },
      rating: {
        'en-US': data.rating
      },
      company: {
        'en-US': data.company
      },
      specialization: {
        'en-US': data.specialization
      },
      licenseNumber: {
        'en-US': data.licenseNumber
      },
      about: {
        'en-US': data.about
      },
      uid: {
        'en-US': entry.fields.uid['en-US']
      },
    }
    entry.fields = fields;
    return entry.update();
  })
  .then((entry) => {
    return publishEntry(entry.sys.id);
  })
  .catch(console.error)
}
