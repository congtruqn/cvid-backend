var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var per_page = 15;
var User = require('../models/register');
var bcrypt = require('bcryptjs');

const UserVerification = require('../models/UserVerification')
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

// Register
router.get('/listuser', function (req, res) {
	res.render('user/listuser', { layout: false });
});
router.get('/getcountuser', function (req, res) {
	User.CountUser(function (err, companys) {
		if (err) throw err;
		res.json({ numofcompany: companys });
	});
});
router.get('/getalluser', function (req, res) {
	var page = req.param.page;
	User.getAllUser(page, per_page, function (err, companys) {
		if (err) throw err;
		res.json(companys);
	});
});
router.get('/getallusernotpage', function (req, res) {
	var page = req.param.page;
	User.getAllUserNotPage(function (err, companys) {
		if (err) throw err;
		res.json(companys);
	});
});
router.get('/getuserinfo/:id', function (req, res) {
	var id = req.params.id;
	User.getUserById(id, function (err, users) {
		if (err) throw err;
		res.json(users);
	});
});
router.get('/getloginuser', function (req, res) {
	var id = req.user._id;
	User.getUserById(id, function (err, users) {
		if (err) throw err;
		res.json(users);
	});
});
router.get('/adduser', function (req, res) {
	res.render('user/adduser', { layout: false });
});
router.get('/edituser', function (req, res) {
	res.render('user/edituser', { layout: false });
});
router.post('/adduserres', function (req, res) {

	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var phone = req.body.phone;
	var address = req.body.address;
	var password = req.body.password;
	var type = req.body.type;


	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('phone', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').notEmpty();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		res.render('register', {
			errors: errors
		});
	} else {
		var newUser = new User({
			name: name,
			username: username,
			phone: phone,
			email: email,
			address: address,
			password: password,
			type: type,
			status: 0
		});
		User.createUser(newUser, function (err, result) {
			if (err) throw err;
			res.send('ok');
			sendVerificationEmail(result, res);
		})
	}

});
const sendVerificationEmail = ({ _id, email }, res) => {
	const currentUrl = 'http://localhost:3000/register'
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
router.post('/edituserres', function (req, res) {
	var id = req.body.userid;
	var name = req.body.name;
	var email = req.body.email;
	var phone = req.body.phone;
	var address = req.body.address;
	var password = req.body.password;
	var type = req.body.type;
	var status = req.body.status;
	if (password == '') {

		var editUser = {
			name: name,
			email: email,
			phone: phone,
			address: address,
			type: type,
			status: status,
		};
		if (req.user.type == 1) {
			User.editUserNotPass(id, editUser, function (err, companys) {
				if (err) throw err;
				res.send('ok');
			});
		} else {
			res.send('Không đủ quyền');
		}


	}
	else {
		var editUser = {
			name: name,
			email: email,
			phone: phone,
			address: address,
			type: type,
			status: status,
			password: password,
		};
		if (req.user.type == 1) {
			User.editUser(id, editUser, function (err, companys) {
				if (err) throw err;
				res.send('ok');
			});
		}
		else {
			res.send('ok');
		}
	}
	res.send('ok');
});
router.post('/deluserres', function (req, res) {
	var id = req.body.id;
	if (req.user.type == 1) {
		User.dellUser(id, function (err, companys) {
			if (err) throw err;
			res.send('ok');
		});
	}

	res.send('ok');
});
router.post('/verify-email', function (req, res) {
	var email = req.body.email;

})

module.exports = router;
