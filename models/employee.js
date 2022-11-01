var bcrypt = require('bcryptjs');
var mongoose = require("mongoose")
const jwt = require('jsonwebtoken');


const accesskey = process.env.CVID_SECRET
// Employee Schema
var EmployeeSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	birthdate: {
		type: Date
	},
	image: String,
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
	skillWorking : Array,
	skillEducation : Array,
	shortTraining : Array,
	skillEnglish : Object, 
	skillLanguage: Array,
	skillComputer: Object,
	skillOther: Array,
	assessment: Array,
	job: Object,

	createdAt: {
		type: Date,
		default: Date.now
	},
	point: {
		type: Number,
		default: -1
	},
	approved: {
		type: Number,
		default: 0
	},
	status: {
		type: Number
	}
});

var Employee = module.exports = mongoose.model('employee', EmployeeSchema);

module.exports.createEmployee = function(newEmployee, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newEmployee.password, salt, function(err, hash) {
	        newEmployee.password = hash;
	        newEmployee.save(callback);
	    });
	});
}

module.exports.editEmployee = function(id,newEmployee, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newEmployee.password, salt, function(err, hash) {
	        newEmployee.password = hash;
	        Employee.findByIdAndUpdate(id, newEmployee, function(err) {
	  			if (err) throw err;
    			console.log('Employee successfully updated!');
			});
	    });
	});
}

module.exports.getEmployeeByUsername = function(username, callback){
	var query = {username: username};
	Employee.findOne(query, callback);
}

module.exports.getEmployeeById = function(id, callback){
	Employee.findById(id, callback);
}

module.exports.deleteEmployeeById = function(id, callback){
	Employee.deleteOne({_id: id}, callback);
}

module.exports.getAllEmployee = function(callback){
	Employee.find({}, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

module.exports.getEmployeeByEmail = function(email, callback){
	var query = {email: email};
	Employee.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

module.exports.createCV = function(id, newCV, callback){
	Employee.findByIdAndUpdate(id, newCV, callback);
}
module.exports.findJob = function(id, job, callback){
	Employee.findByIdAndUpdate(id, job, callback);
}
module.exports.getEmployeeByListId = function(list, callback){
	var query = {"_id": { $in: list }};
	Employee.find(query, {password: 0, type: 0, status: 0} ,callback);
}

module.exports.getEmployeeByQuery = function(query, callback){
	Employee.find(query, {password: 0, type: 0, status: 0} ,callback);
}
module.exports.getEmployeeByQuery = function(query, callback){
	Employee.find(query, {password: 0, type: 0, status: 0} ,callback);
}

module.exports.browseCV = function(id, callback){
	Employee.findByIdAndUpdate(id, {approved: 1} ,callback);
}
