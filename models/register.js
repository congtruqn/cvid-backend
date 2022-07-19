var bcrypt = require('bcryptjs');
var mongoose = require("mongoose")
const jwt = require('jsonwebtoken');

const nodemailer = require('nodemailer')
const { v4: uuidv4 } = require('uuid')
// require('dotenv').config();

const accesskey = process.env.CVID_SECRET
// User Schema
var UserSchema = mongoose.Schema({
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
	nameforeign: String,
	nameacronym: String,
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
	degrees: [{
        name: String,
		level: String,
        year: String,
        school: String,
        major: String,
		skill: String,
        code: String,
    }],
    skills: [{
            name: String,
            school: String,
            year: String
    }],
    companies: [{
        name: String,
        position: [{
            name: String,
            year: String,
            from: String,
            to: String,
            work: String,
            address: String
        }]
    }],
	assessment: Array,
	point: 0,
	type: {
		type: Number
	},
	status: {
		type: Number
	}
});

var User = module.exports = mongoose.model('users', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
	sendVerificationEmail(newUser);
	console.log(newUser)
}

module.exports.editUser = function(id,newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        User.findByIdAndUpdate(id, newUser, function(err) {
	  			if (err) throw err;
    			console.log('User successfully updated!');
			});
	    });
	});
}
module.exports.editUserNotPass = function(id,newCompany, callback){
	User.findByIdAndUpdate(id, newCompany, function(err) {
	  	if (err) throw err;
    		console.log('User successfully updated!');
	});
}
module.exports.dellUser = function(id,callback){
	User.findByIdAndRemove(id, function(err, user) {
  	if (err) throw err;
  		console.log(user);
	});
}

module.exports.getAllUser = function(page,per_page,callback){
	var query = {};
	User.find(query, callback).skip(per_page * (page - 1)).limit(per_page);
}
module.exports.getAllUserNotPage = function(callback){
	var query = {};
	User.find(query, callback);
}

module.exports.CountUser = function(callback){
	var query = {};
	User.count(query, callback);
}
module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
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
module.exports.getUserByEmail = function(email, callback){
	var query = {email: email};
	User.findOne(query, callback);
}

module.exports.createCV = function(id,newCV, callback){
	User.findByIdAndUpdate(id, newCV, callback);
}