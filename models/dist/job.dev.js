"use strict";

var mongoose = require("mongoose"); // User Schema


var JobSchema = mongoose.Schema({
  employee_id: String,
  position_id: String,
  business_id: String,
  type: Number,
  status: {
    type: Number,
    "default": 0
  },
  schedule: String
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

module.exports.getCvidForBusiness = function (business_id, callback) {
  var query = {
    business_id: business_id
  };
  Job.find(query, callback);
};

module.exports.getCvidForPosition = function (position_id, callback) {
  var query = {
    position_id: position_id
  };
  Job.find(query, callback);
};

module.exports.updatePayment = function (job, callback) {
  Job.update({
    _id: job._id
  }, {
    $set: {
      status: 1,
      schedule: job.schedule
    }
  }, callback);
};