"use strict";

var mongoose = require("mongoose"); // User Schema


var JobTitleSchema = mongoose.Schema({
  name: String
});
var JobTitle = module.exports = mongoose.model('jobtitle', JobTitleSchema);

module.exports.getAllJobTitle = function (callback) {
  JobTitle.find(callback);
};