var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const accesskey = process.env.CVID_SECRET;
// Employee Schema
var BusinessSchema = mongoose.Schema({
  username: {
    type: String,
    index: true,
  },
  manager: String,
  phone: String,
  position: String,
  type_business: String,
  password: String,
  email: String,
  name: String,
  industries: Array,
  country: String,
  province: String,
  district: String,
  ward: String,
  address: String,
  majors: String,
  urlGPKD: String,
  type: {
    type: Number,
  },
  createAt: {
	type: Date,
	default: Date.now
  },
  confirm1: {
    status: {
      type: Number,
      default: 0,
    },
    confirmBy: String,
    confirmAt: {
      type: Date,
      default: Date.now,
    },
  },
  confirm2: {
    status: {
      type: Number,
      default: 0,
    },
    confirmBy: String,
    confirmAt: {
      type: Date,
      default: Date.now,
    },
  },
  status: {
    type: Number,
    default: 0,
  },
});

var Business = (module.exports = mongoose.model("business", BusinessSchema));

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
        console.log("Business successfully updated!");
      });
    });
  });
};

module.exports.deleteBusiness = function (id, callback) {
  Business.findByIdAndRemove(id, callback);
};

module.exports.getBusinessByUsername = function (username, callback) {
  var query = { username: username };
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

module.exports.getBusinessByEmail = function (email, callback) {
  var query = { email: email };
  Business.findOne(query, callback);
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
};

module.exports.confirm1 = function (id, confirm, callback) {
  Business.findByIdAndUpdate(id, { confirm1: confirm }, callback);
};

module.exports.confirm2 = function (id, confirm, callback) {
  Business.findByIdAndUpdate(id, { confirm2: confirm }, callback);
};
