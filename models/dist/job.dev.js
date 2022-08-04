"use strict";

var mongoose = require("mongoose"); // User Schema


var JobSchema = mongoose.Schema({
  employee_id: String,
  position_id: String,
  type: Number,
  status: {
    type: Number,
    "default": 0
  }
});
var Job = module.exports = mongoose.model('job', JobSchema);

module.exports.addJob = function (job, callback) {
  job.save(callback);
};

module.exports.checkJob = function (employee, position, callback) {
  var query = {
    employee_id: employee,
    position_id: position
  };
  Job.findOne(query, callback);
};

module.exports.getJobForEmployee = function (employee_id, callback) {
  var query = {
    employee_id: employee_id
  };
  Job.find(query, callback);
};

module.exports.getJobForPosition = function (position_id, callback) {
  var query = {
    position_id: position_id
  };
  Job.find(query, callback);
};