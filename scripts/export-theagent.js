require('babel-register');
require('babel-polyfill');

const Promise = require('bluebird');

var mysql      = require('mysql');
var jsonfile = require('jsonfile');
var moment = require('moment');
var _  = require('lodash');
const dotenv = require('dotenv');

dotenv.load({ path: '.env' });

var contentful = require('contentful-management');

var client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_ACCESSTOKEN_MANAGEMENT,
});

var host = "127.0.0.1";
var port = "8889";
var username = "root";
var password = "root";
var dbname = "propshops";


var connection = mysql.createConnection({
  host     : host,
  port     : port,
  user     : username,
  password : password,
  database : dbname
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

function mapTheAgentPropertyTypeCode(agentPTCode) {
  switch (agentPTCode) {
    case 'PT001': return 'Apartment';
    case 'PT002': return 'Building/Project';
    case 'PT003': return 'Commercial Space';
    case 'PT004': return 'Condominium';
    case 'PT005': return 'Factory/Warehouse';
    case 'PT006': return 'Home office';
    case 'PT007': return 'House';
    case 'PT008': return 'Land';
    case 'PT009': return 'ShopHouse';
    case 'PT010': return 'Town Home';
    case 'PT011': return 'Retail Shop';
    case 'PT012': return 'House in Compound';
    default: return '';
  }
}

const toContentfulPropertyFields = (data) => {

  const mainImage = _.get(data, 'coverImage');
  const images = _.get(data, 'images');
  return _.assign({},
    _.omit(data, ['post']), {
      propertyType: {
        'en-US': data.propertyType,
      },
      name: {
        'en-US': data.name,
      },
      nameEn: {
        'en-US': data.name.en,
      },
      nameTh: {
        'en-US': data.name.th,
      },
      description: {
        'en-US': data.description,
      },
      locationMarker: {
        'en-US': {
          lat: data.location.latitude,
          lon: data.location.longitude,
        },
      },
      location: {
        'en-US': data.location,
      },
      attributes: {
        'en-US': data.attributes,
      },
      numBedrooms: { 'en-US': data.attributes.numBedrooms },
      numBathrooms: { 'en-US': data.attributes.numBathrooms },
      areaUsable: {
        'en-US': data.areaUsable,
      },
      areaLand: {
        'en-US': data.areaLand,
      },
      forSale: {
        'en-US': data.forSale,
      },
      forRent: {
        'en-US': data.forRent,
      },
      priceSale: {
        'en-US': data.priceSale,
      },
      priceRent: {
        'en-US': data.priceRent,
      },
      status: {
        'en-US': data.status,
      },
      parentProperty: undefined,
      postCurrent: undefined,
      postHistory: {
        'en-US': data.postHistory,
      },
      tags: {
        'en-US': data.tags,
      },
    }
  );
};


const createProperty = (space, p, assets) => {
  const imagesPromise = _.map(p.images, (imageURL, index) => {
    console.log('Importing Asset', imageURL);

    if (assets[imageURL]) {
      console.log(`Existing Image ${imageURL}, cool!`);
      return new Promise(resolve => resolve(assets[imageURL]));
    } else {
      // Create asset
      return space.createAsset({
        fields: {
          title: { 'en-US': imageURL },
          file: {
            'en-US': {
              contentType: 'image/jpg',
              fileName: imageURL,
              upload: imageURL
            }
          }
        }
      })
      .then((asset) => asset.processForAllLocales())
      .then((asset) => asset)
      .catch(error => console.log(error));
    }
  });

  return Promise.all(imagesPromise)
  .then(allImages => {
    console.log(`Importing Asset ${_.map(allImages, img => img.sys.id)} Done`);
    const propertyField = toContentfulPropertyFields(p);
    propertyField.images = {
      'en-US': _.map(allImages, image => {
        return {
          'sys': {
            id: image.sys.id,
            linkType: "Asset",
            type: "Link"
          },
        };
      }),
    };

    if (_.size(allImages)) {
      propertyField.coverImage = {
        'en-US': {
          'sys': {
            id: _.get(_.head(allImages), 'sys.id'),
            linkType: "Asset",
            type: "Link"
          },
        },
      };
    }

    console.log('Imported Entry', p.name.en ,' Completed');
    return space.createEntry('property', {
      fields: propertyField,
    })
    .then(entry => entry.publish())
    .then(entry => {
      return entry;
    })

  })
  .catch(error => console.log(error));

};

const truncateProperties = async (space) => {

  const currentEntries = await space.getEntries({'content_type': 'property'}).then(response => response.items);

  for(const entry of currentEntries) {
    await entry.unpublish().then(entry => entry.delete());
  }
  console.log('============================================');
  console.log(`     Delete ${_.size(currentEntries)} Done!`);
  console.log('============================================');
};

const createProperties = async (space, rows, assets) => {
  for(const row of rows) {
    await createProperty(space, row, assets);
  }
  console.log('============================================');
  console.log(`     Imported ${_.size(rows)} Done!`);
  console.log('============================================');
};

connection.query('SELECT * from item LEFT JOIN Project ON item.ProjectCode = Project.ProjectCode LIMIT 200', async (err, dbRows, fields) => {
  if (err) {
    console.log('Error while performing Query.', err);
    return;
  }
  console.log('Importing ', _.size(dbRows), ' rows');

  // const rows = _.take(dbRows, 1);
  const rows = _.filter(dbRows, row => !/\s|[ก-ฮ]/g.test(row.ItemPathImage2));
  console.log('filter Item with unformatted image url, importing ', _.size(rows), ' rows');

  var properties = _.map(rows, function(row) {

    const itemForSale = _.includes(['RT001', 'RT003', 'RT004'], row.RequirementTypeCode);
    const itemForRent = _.includes(['RT002', 'RT003'], row.RequirementTypeCode);

    return {
      propertyType: mapTheAgentPropertyTypeCode(row.PropertyTypeCode),
      parentProperty: '',
      name: {
        en: `Unit ${row.ItemUnitNo} ${row.ProjectName}`,
        th: `Unit ${row.ItemUnitNo} ${row.ProjectNameTH}`,
      },
      description: {
        en: '',
        th: row.ItemRemark,
      },
      location: {
        summary: {
          en: row.Location,
          th: row.LocationTH,
        },
        full: {
          en: row.ProjectLocation,
          th: row.ProjectLocation,
        },
        unitNo: row.ItemUnitNo,
        floorNo: row.ItemFloor,
        buildingNo: '',
        mooNo: '',
        soi: row.ItemAddressSoi,
        street: row.ItemAddressRoad,
        subDistrict: row.ItemAddressSubDistrict,
        district: row.ItemAddressDistrict,
        zipcode: row.ItemAddressPostCode,
        province: row.Province1,
        latitude: _.toNumber(_.split(row.Map, ',')[0]),
        longitude: _.toNumber(_.split(row.Map, ',')[1]),
        publicTransports: _.compact([
          !_.isEmpty(row.BTSStationCode) ? {
            type: 'BTS',
            name: row.BTSStationCode,
            distance: row.BTSFar,
          } : undefined,
          !_.isEmpty(row.MRTStationCode) ? {
            type: 'MRT',
            name: row.MRTStationCode,
            distance: row.MRTFar,
          } : undefined,
          !_.isEmpty(row.BRTStationCode) ? {
            type: 'BRT',
            name: row.BRTStationCode,
            distance: row.BRTFar,
          } : undefined,
        ]),
        areas: _.compact([row.Zone1, row.ZoneTH1, row.Province1, row.ProvinceTH1]),
      },
      attributes: {
        numBedrooms: row.ItemBedNo,
        numBathrooms: row.ItemBath,
        numFloors: 1,
        yearBuilt: row.OriginalYearPrice,
      },
      areaUsable: {
        value: row.Itemsize,
        detail: '',
        width: '',
        height: '',
        unit: 'sqm',
      },
      areaLand: {
        value: '',
        detail: '',
        width: '',
        height: '',
        unit: 'sqm',
      },
      forSale: itemForSale,
      forRent: itemForRent,
      priceSale: itemForSale ? {
        type: 'sale',
        value: row.ItemPrice,
        currency: 'thb',
        detail: '',
        discount: 0,
        until: ''
      } : undefined,
      priceRent: itemForRent ? {
        type: 'rent',
        value: row.ItemPriceRent,
        currency: 'thb',
        detail: '',
        discount: 0,
        until: '',
      } : undefined,
      priceHistory: [],
      post: {
        current: 'postID',
        history: [],
      },
      tags: _.reduce(_.pick(row, [
        // Property
        'Investment',
        'Recommend',
        'BelowCost',
        'AtCost',
        'UrgentSale',
        'VIPUnit',
        'reentry',
        'ExecutiveUnit',
        'CreamUnit',
        'InterUnit',
        'Pet',
        // Project
        'CarPark',
        'SwimmingPool',
        'TennisCourt',
        'PlayGround',
        'Fitness',
        'Steam',
        'Sauna',
        'Jacuzzi',
        'PetAllowed',
        'WiFi',
        'Luxury',
        'DesignCollection',
        'WorldClassCollection',
        'LuxuryAffordable',
        'SurpriseCollection',
        'MechanicalParking',
        'PrivateLife',
        'Library',
        'PaddingPool',
        'ClubHouse',
        'SkyLounge',
        'RentalService',
        'Laundry',
        'Shuttle',
        'AccessCard',
      ]), (acc, val, key) => val !== null && val.readUIntBE(0, 1) === 1 ? [...acc, key] : acc, []),
      images: [
        `http://www.theagent.co.th/detail/property/${row.ItemCode}/${row.ItemPathImage2}`,
      ],
    };
  }); // end of map properties

  client.getSpace(process.env.CONTENTFUL_SPACE)
  .then(async space => {

    await truncateProperties(space);

    const assets = await space.getAssets()
    .then(response => {
      const assets = {};
      _.forEach(response.items, item => {
        assets[_.get(item, 'fields.title.en-US')] = item;
      });
      return assets;
    });
    // .then((assets) => {
    createProperties(space, properties, assets);
    // });
  }); // client.getSpace
});


connection.end();
