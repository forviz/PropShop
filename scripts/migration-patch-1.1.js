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

const updateEntry = (space, entry) => {
  // if (entry.fields.priceSale) _.set(entry, 'fields.priceSaleValue.en-US', entry.fields.priceSale['en-US'].value);
  // if (entry.fields.priceRent) _.set(entry, 'fields.priceRentValue.en-US', entry.fields.priceRent['en-US'].value);
  // _.set(entry, 'fields.projectName.en-US', _.replace(entry.fields.nameEn['en-US'].value, `Unit ${_.get(entry, 'fields.location.en-US.unitNo')}`, ''));
  // _.set(entry, 'fields.areaSize.en-US', _.toNumber(entry.fields.areaUsable['en-US'].value));
  // _.set(entry, 'fields.province.en-US', entry.fields.location['en-US'].province);
  // _.set(entry, 'fields.locationMarker.en-US', { lat: entry.fields.location['en-US'].latitude, lon: entry.fields.location['en-US'].longitude });
  console.log('Updated', entry.sys.id);
  return entry.update().publish();
}

client.getSpace(process.env.CONTENTFUL_SPACE)
.then(async space => {
  // select: 'sys.id,fields.priceSale,fields.priceRent'
  const response = await space.getEntries({ content_type: 'property', limit: 1000 });

  for(const entry of response.items) {
    await updateEntry(space, entry);
  }
  console.log(`Update operations done on ${_.size(response.items)} entries`);
});
