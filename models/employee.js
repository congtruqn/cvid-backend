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
	name: String,
	country: String,
	province: String,
	district: String,
	ward: String,
	address: String,
	level: String,
	school: String,
	startyear: Number,
	endyear: Number,
	major: String,
	skill: String,
	position: String,
	skillWorking : Array,
	skillEducation : Array,
	shortTraining : Array,
	skillEnglish : Object, 
	skillLanguage: Array,
	skillComputer: Object,
	skillOther: Array,
	assessment: Array,
	jobs: Object,
	point: 0,
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

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}
module.exports.checkLogin = function(token){
	return new Promise((resolve,reject) =>{
		jwt.verify(token,accesskey, function(err, decoded) {
			console.log(err)
			if(err){
				resolve(false);
			}
			else{
				resolve(true);
			}
		})
	})
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

module.exports.getEmployeeByListId = function(list, callback){
	var query = {"_id": { $in: list }};
	Employee.find(query, {password: 0, type: 0, status: 0} ,callback);
}