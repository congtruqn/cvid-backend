
var bcrypt = require('bcryptjs');
var mongoose = require("mongoose")

// Employee Schema
var employeeSchema = mongoose.Schema({
	email: {
		type: String,
        unique: true,
	},
    password: {
        type: String,
    },
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    type: {
        type: Number,
        default: 4
    },
    status: {
        type: Number,
        default: 0
    }

});
var Employee = module.exports = mongoose.model('employee', employeeSchema);

module.exports.createEmployee = function(newEmployee, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newEmployee.password, salt, function(err, hash) {
            newEmployee.password = hash;
            newEmployee.save(callback);
        });
    });
}

module.exports.checkEmail = function(email, callback){
    var query = {email: email};
    Employee.findOne(query, callback);
}

