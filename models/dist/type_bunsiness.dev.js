"use strict";

var mongoose = require("mongoose"); // User Schema


var TypeBusinessSchema = mongoose.Schema({
  name: String
});
var TypeBusiness = module.exports = mongoose.model('type_business', TypeBusinessSchema);

module.exports.getAllTypeBusiness = function (callback) {
  TypeBusiness.find(callback);
};