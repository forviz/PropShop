import _ from 'lodash';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const propertySchema = new mongoose.Schema({
  name: String,
}, { timestamps: true });

propertySchema.statics.aa = function (xx) {
  console.log('aaaaaaaaaaaa');
};

propertySchema.methods.bb = function bb() {
  console.log('aaaaaaaaaaaa');
  return 123;
  // return this.listCollections();
};

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
