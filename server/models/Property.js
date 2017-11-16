import _ from 'lodash';

const mongoose = require('mongoose');

const MODEL = 'Property';

const schema = new mongoose.Schema({
  for: String,
  propertyType: String,
  topic: String,
  description: String,
  bathroom: Number,
  bedroom: Number,
  price: Number,
  address: String,
  location: {
    lat: String,
    lng: String,
  },
  images: [String],
  areaSize: Number,
  landSize: Number,
  fee: Number,
  project: String,
  facilities: [String],
  userId: String,
}, { timestamps: true });

schema.methods.properties = function (callback) {
  const query = _.omitBy({
    for: this.for,
    propertyType: this.propertyType,
    bathroom: this.bathroom,
    bedroom: this.bedroom,
  }, val => val === undefined || val === '' || val === false);
  return this.model(MODEL).find(query).where().exec(callback);
};

const Property = mongoose.model(MODEL, schema);

module.exports = Property;
