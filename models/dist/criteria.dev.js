"use strict";

var mongoose = require("mongoose"); // User Schema


var CriteriaSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  detail: Array
});
var Criteria = module.exports = mongoose.model('criteria', CriteriaSchema);

module.exports.getallCriteria = function (callback) {
  var query = {};
  Criteria.find(query, callback);
};