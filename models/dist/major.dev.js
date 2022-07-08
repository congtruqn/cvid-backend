"use strict";

var mongoose = require("mongoose"); // User Schema


var MajorSchema = mongoose.Schema({
  name: String,
  level: String,
  skills: Array,
  position: Array
});
var Major = module.exports = mongoose.model('major', MajorSchema);

module.exports.addSkillForMajor = function (level, major, skill, callback) {
  Major.findOneAndUpdate({
    level: level,
    name: major
  }, {
    $push: {
      skills: skill
    }
  }, callback);
};

module.exports.getallMajor = function (callback) {
  var query = {};
  Major.find(query, callback);
}; // module.exports.editMajor = function(id,newMajor, callback){
//     Major.findByIdAndUpdate(id, newMajor, callback);
// }


module.exports.addPosition = function (major_name, position, callback) {
  Major.updateMany({
    name: major_name
  }, {
    $addToSet: {
      position: position
    }
  }, callback);
};