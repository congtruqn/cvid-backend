var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var per_page = 15;
var User = require('../models/register');

// Register
router.post('/createuser', function(req, res){
	var email = req.body.email;
	var password = req.body.password;

	var fullname = req.body.fullname;
	var dateofbirth = req.body.dateofbirth;
	var citizenid = req.body.citizenid;

	var hometown = {
		province: req.body.hometown_province,
		district: req.body.hometown_district,
		commune: req.body.hometown_commune
	};
	var address = {
		province: req.body.address_province,
		district: req.body.address_district,
		commune: req.body.address_commune,
		street: req.body.address_street
	}
	var literacy = req.body.literacy;
	var technique = req.body.technique;
	var experience = {
		start_month: req.body.experience_start_month,
		start_year: req.body.experience_start_year,
		end_month: req.body.experience_end_month,
		end_year: req.body.experience_end_year
	};

	// Validation
	req.checkBody('citizenid', 'Citizen ID is required').notEmpty();
	req.checkBody('fullname', 'Full name is required').notEmpty();
	req.checkBody('dateofbirth', 'Date of birth is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('hometown_province', 'Hometown is required').notEmpty();
	req.checkBody('hometown_district', 'Hometown is required').notEmpty();
	req.checkBody('hometown_commune', 'Hometown is required').notEmpty();
	req.checkBody('address_province', 'Address is required').notEmpty();
	req.checkBody('address_district', 'Address is required').notEmpty();
	req.checkBody('address_commune', 'Address is required').notEmpty();
	req.checkBody('address_street', 'Address is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
	req.checkBody('literacy', 'Literacy is required').notEmpty();
	req.checkBody('technique', 'Technique is required').notEmpty();
	req.checkBody('experience_start_month', 'Experience is required').notEmpty();
	req.checkBody('experience_start_year', 'Experience is required').notEmpty();
	req.checkBody('experience_end_month', 'Experience is required').notEmpty();
	req.checkBody('experience_end_year', 'Experience is required').notEmpty();

	var errors = req.validationErrors();
	
	if (errors) {
		res.render('register', {
			errors: errors
		});
	} else {
		User.checkRegister('email', email, function(err, user){
			if(err) throw err;
			if(user){
				res.render('register', {
					errors: [{msg: 'Email is already registered'}]
				});
			}
			else{

				var newUser = new User({
					email: email,
					password: password,
					fullname: fullname,
					dateofbirth: dateofbirth,
					citizenid: citizenid,
					hometown: hometown,
					address: address,
					literacy: literacy,
					technique: technique,
					experience: experience,
					type: 0,
					status: 0
				});

				User.createUser(newUser, function(err, user){
					if (err) throw err;
					res.json(user);
				});

				req.flash('success_msg', 'You are registered and can now login');
				// res.redirect('/users/login');
			}
		});
	}



});
router.get('/listuser', function(req, res){
	res.render('user/listuser',{layout: false});
});
router.get('/getcountuser', function(req, res){
	User.CountUser(function(err, companys){
			if(err) throw err;
			res.json({numofcompany:companys});
		});
});
router.get('/getalluser', function(req, res){
	var page = req.param.page;
	User.getAllUser(page,per_page,function(err, companys){
		if(err) throw err;
		res.json(companys);
	});
});
router.get('/getallusernotpage', function(req, res){
	var page = req.param.page;
	User.getAllUserNotPage(function(err, companys){
		if(err) throw err;
		res.json(companys);
	});
});
router.get('/getuserinfo/:id', function(req, res){
	var id = req.params.id;
	User.getUserById(id, function(err, users) {
    	if(err) throw err;
		res.json(users);
  	});
});
router.get('/getloginuser', function(req, res){
	var id = req.user._id;
	User.getUserById(id, function(err, users) {
    	if(err) throw err;
		res.json(users);
  	});
});
router.get('/adduser', function(req, res){
	res.render('user/adduser',{layout: false});
});
router.get('/edituser', function(req, res){
	res.render('user/edituser',{layout: false});
});
router.post('/adduserres', function(req, res){

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

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			username: username,
			phone: phone,
			email: email,
			address:address,
			password: password,
			type:type,
			status:1
		});
		User.createUser(newUser, function(err, companys){
			if(err) throw err;
			res.send('ok');
		});
	}
	
});
router.post('/edituserres', function(req, res){
	var id = req.body.userid;
	var name = req.body.name;
	var email = req.body.email;
	var phone = req.body.phone;
	var address = req.body.address;
	var password = req.body.password;
	var type = req.body.type;
	var status = req.body.status;
	if(password==''){
	
		var editUser = {
			name:name,
			email:email,
			phone: phone,
			address:address,
			type:type,
			status:status,
		};
		if(req.user.type==1){
			User.editUserNotPass(id,editUser,function(err, companys) {
	    	if(err) throw err;
			res.send('ok');
  			});
		}else{
			res.send('Không đủ quyền');
		}
		
		
	}
	else{
		var editUser = {
			name:name,
			email:email,
			phone: phone,
			address:address,
			type:type,
			status:status,
			password:password,
		};
		if(req.user.type==1){
			User.editUser(id,editUser,function(err, companys) {
	    		if(err) throw err;
				res.send('ok');
  			});
		}
		else{
			res.send('ok');
		}
	}
  	res.send('ok');
});
router.post('/deluserres', function(req, res){
	var id = req.body.id;
	if(req.user.type==1){
		User.dellUser(id, function(err, companys){
			if(err) throw err;
			res.send('ok');
		});
	}
  	
  	res.send('ok');
});
module.exports = router;
