var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const accesskey = process.env.CVID_SECRET;
// Employee Schema
var EmployeeSchema = mongoose.Schema({
  username: {
    type: String,
    index: true,
  },
  password: String,
  email: String,
  birthdate: Date,
  image: {
    type: String,
    default:
      "https://www.lewesac.co.uk/wp-content/uploads/2017/12/default-avatar.jpg",
  },
  gender: String,
  name: String,
  country: String,
  province: String,
  district: String,
  ward: String,
  address: String,
  level: String,
  school: String,
  startyear: Date,
  professionaltitle: String,
  endyear: Date,
  skill: String,
  jobtitle: String,
  skillWorking: Array,
  skillEducation: Array,
  shortTraining: Array,
  skillEnglish: Object,
  skillLanguage: Array,
  skillComputer: Object,
  skillOther: Array,
  assessment: Array,
  noteCV: String,
  job: Object,
  confirmEmail: {
    type: Boolean,
    default: false,
  },
  confirmPhone: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  point: {
    type: Number,
    default: -1,
  },
  confirm1: {
    confirmBy: String,
    confirmAt: Date,
    status: {
      type: Number,
      default: 0,
    },
  },
  confirm2: {
    confirmBy: String,
    confirmAt: Date,
    status: {
      type: Number,
      default: 0,
    },
  },
  status: {
    type: Number,
    default: 0,
  },
});

var Employee = (module.exports = mongoose.model("employee", EmployeeSchema));

module.exports.createEmployee = function (newEmployee, callback) {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(newEmployee.password, salt, function (err, hash) {
      newEmployee.password = hash;
      newEmployee.save(callback);
    });
  });
};

module.exports.editEmployee = function (id, newEmployee, callback) {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(newEmployee.password, salt, function (err, hash) {
      newEmployee.password = hash;
      Employee.findByIdAndUpdate(id, newEmployee, function (err) {
        if (err) throw err;
        console.log("Employee successfully updated!");
      });
    });
  });
};

module.exports.getEmployeeByUsername = function (username, callback) {
  var query = { username: username };
  Employee.findOne(query, callback);
};

module.exports.getEmployeeById = function (id, callback) {
  Employee.findById(id, callback);
};

module.exports.deleteEmployeeById = function (id, callback) {
  Employee.deleteOne({ _id: id }, callback);
};

module.exports.getAllEmployee = function (callback) {
  Employee.find({}, callback);
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
};

module.exports.getEmployeeByEmail = function (email, callback) {
  var query = { email: email };
  Employee.findOne(query, callback);
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
};

module.exports.createCV = function (id, newCV, callback) {
  Employee.findByIdAndUpdate(id, newCV, callback);
};
module.exports.findJob = function (id, job, callback) {
  Employee.findByIdAndUpdate(id, job, callback);
};
module.exports.getEmployeeByListId = function (list, callback) {
  var query = { _id: { $in: list } };
  Employee.find(query, { password: 0, type: 0, status: 0 }, callback);
};

module.exports.getEmployeeByQuery = function (query, callback) {
  Employee.find(query, { password: 0, type: 0, status: 0 }, callback);
};
module.exports.getEmployeeByQuery = function (query, callback) {
  Employee.find(query, { password: 0, type: 0, status: 0 }, callback);
};

module.exports.confirm1 = function (id, confirm, note, callback) {
  Employee.findByIdAndUpdate(id, { confirm1: confirm, confirmNote: note}, callback);
};

module.exports.confirm2 = function (id, confirm, note, callback) {
  Employee.findByIdAndUpdate(id, { confirm2: confirm, confirmNote: note }, callback);
};