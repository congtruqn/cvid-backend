var express = require('express');
var router = express.Router();
var cors = require('cors')
var User = require('../models/register');

router.post('/register', function(req, res){

    var name = req.body.name;
    var MST = req.body.MST;
    var email = req.body.email;
    var password = req.body.password;
    var address = {
        province_id: req.body.province[0],
        province: req.body.province[1],
        district_id: req.body.district[0],
        district: req.body.district[1]
    }
    var majors = [];
    for (var i = 0; i < req.body.majors.length; i++) {
        majors.push({name: req.body.majors[i], skills: []});
    }

    console.log(address);
    // Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('MST', 'MST is required').notEmpty();
    req.checkBody('MST', 'MST phải có độ dài ít nhất 10 kí tự').isLength({min: 10});
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('province', 'City is required').notEmpty();
    req.checkBody('district', 'District is required').notEmpty();
    req.checkBody('majors', 'Major is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
    } else {

        User.getUserByEmail(email, function(err, user){
			if(err) throw err;
			if(user){
                res.send([{param: 'email', msg: 'Email is already registered', value: email}]);
			} else{
                var newBusiness = new User({
                    name: name,
                    MST: MST,
                    email: email,
                    password: password,
                    address: address,
                    majors: majors,
                    type: 5,
                    status: 0
                });
                User.createUser(newBusiness, function(err, companys) {
                    if (err) throw err;
                    res.send('ok');
                });
            }
        });    
    }
});

module.exports = router;
