"use strict";

var mongoose = require("mongoose"); // User Schema


var MajorSchema = mongoose.Schema({
  name: {
    type: String
  },
  level: {
    type: String
  },
  skills: []
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
// module.exports.createSkillForMajor = function(major_id, skill, callback){
//     Major.findOneAndUpdate({name: major_id}, {$push: {skills: skill}}, callback);
// }