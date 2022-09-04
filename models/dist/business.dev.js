"use strict";

var bcrypt = require('bcryptjs');

var mongoose = require("mongoose");

var jwt = require('jsonwebtoken');

var accesskey = process.env.CVID_SECRET; // Employee Schema

var BusinessSchema = mongoose.Schema({
  username: {
    type: String,
    index: true
  },
  password: {
    type: String
  },
  email: {
    type: String
  },
  name: String,
  nameforeign: String,
  nameacronym: String,
  country: String,
  province: String,
  district: String,
  ward: String,
  address: String,
  level: String,
  majors: Array,
  position: String,
  type: {
    type: Number
  },
  status: {
    type: Number
  }
});
var Business = module.exports = mongoose.model('business', BusinessSchema);

module.exports.createBusiness = function (newBusiness, callback) {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(newBusiness.password, salt, function (err, hash) {
      newBusiness.password = hash;
      newBusiness.save(callback);
    });
  });
};

module.exports.editBusiness = function (id, newBusiness, callback) {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(newBusiness.password, salt, function (err, hash) {
      newBusiness.password = hash;
      Business.findByIdAndUpdate(id, newBusiness, function (err) {
        if (err) throw err;
        console.log('Business successfully updated!');
      });
    });
  });
};

module.exports.getBusinessByUsername = function (username, callback) {
  var query = {
    username: username
  };
  Business.findOne(query, callback);
};

module.exports.getBusinessById = function (id, callback) {
  Business.findById(id, callback);
};

module.exports.getAllBusiness = function (callback) {
  Business.find({}, callback);
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
};

module.exports.checkLogin = function (token) {
  return new Promise(function (resolve, reject) {
    jwt.verify(token, accesskey, function (err, decoded) {
      console.log(err);

      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

module.exports.getBusinessByEmail = function (email, callback) {
  var query = {
    email: email
  };
  Business.findOne(query, callback);
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
};