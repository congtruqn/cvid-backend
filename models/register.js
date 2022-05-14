var bcrypt = require('bcryptjs');
var mongoose = require("mongoose")
const jwt = require('jsonwebtoken');
var UserVerification = require('UserVerification')
const nodemailer = require('nodemailer')
const { v4: uuidv4 } = require('uuid')
// require('dotenv').config();
let transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: `plvhoang09@gmail.com`,
		pass: `phamluuvyhoang`
	}
})
transporter.verify((error, success) => {
	if (error) {
		console.log(error)
	}
	else {
		console.log('Ready for message');
		console.log(success);
	}
})
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
	name: {
		type: String,
	},
	province:{
		Id: {
			type: String
		},
		Name: {
			type: String
		}
	},
	district: {
		Id: {
			type: String
		},
		Name: {
			type: String
		}
	},

	address: {
		type: String
	},
	majors: [
		{
			name: {
				type: String
			},
			skills: [
				{
					name: {
						type: String
					}
				}
			]
		}
	],	
	level: {
		type: String
	},
	specialty: {
		type: String
	},
	experience: {
		start: {
			type: Date
		},
		end: {
			type: Date
		}
	},
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
	sendVerificationEmail(result, res);
}
const sendVerificationEmail = ({ _id, email }, res) => {
	const currentUrl = 'https://staging-cvid-api-ggczm4ik6q-an.a.run.app/register'
	const uniqueString = uuidv4() + _id;
	const mailOptions = {
		from: 'plvhoang@gmail.com',
		to: email,
		subject: 'Verify Your Email',
		html: 	`<div>
					<p>Verify your email to complete sign up.</p>
					<p>Click here: <a href=${currentUrl + "/verify/" + _id + '/' + uniqueString}> Verify Link </a> </p>
				</div>`
	}
	console.log(currentUrl + "/verify/" + _id + '/' + uniqueString)
	const saltRounds = 10;
	bcrypt.hash(uniqueString, saltRounds)
		.then((hashedUniqueString) => {
			const newVerification = new UserVerification({
				userId: _id,
				uniqueString: hashedUniqueString,
				createdAt: Date.now()
			})
			newVerification
				.save()
				.then(() => {
					transporter
						.sendMail(mailOptions)
						.then()
						.catch((error) => {
							console.log(error)
							res.json({
								status: 'PENDING',
								message: "Verification email sent"
							})
						})
				})
				.catch((error) => {
					console.log(error)
					res.json({
						status: 'FAILED',
						message: "Couldn't save verification email data"
					})
				})
		})
		.catch(() => {
			res.json({
				status: 'FAILED',
				message: 'An error occurred while hashing email!'
			})
		})
}
//verify email
router.get("/verify/:userId/:uniqueString",(req,res)=>{
	let { userId, uniqueString } = req.params;
	UserVerification
		.find({userId})
		.then((result) =>{
			console.log(result)
			if(result.length>0){
				var  hashedUniqueString = result[0].uniqueString;
				console.log(hashedUniqueString)
				bcrypt
					.compare(uniqueString,hashedUniqueString)
					.then(result=>{
						if(result){
							User
								.findOneAndUpdate({_id: userId},{status:1})
								.then(()=>{
									UserVerification
										.deleteOne({userId})
										.catch((error)=>{
											console.log(error)
										})
								})
								.catch(error=>{
									console.log(error)
								})
							res.send("Verify successful")
						}
						else{
							res.send("Verify fail!!!")
						}
					})
					.catch(error=>{
						console.log(error)
					})
			}
			else{
				let message
			}
		})
		.catch((error)=>{
			console.log(error)
		})
})
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