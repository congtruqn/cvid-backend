var express = require('express');
var router = express.Router();
var cors = require('cors')
var User = require('../models/register');

router.post('/register', function(req, res){
    var email = req.body.email;
    var password = req.body.password;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;

    // Validation
    req.checkBody('firstname', 'Firstname is required').notEmpty();
    req.checkBody('lastname', 'Lastname is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
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
                var newEmployee = new User({
                    email: email,
                    password: password,
                    firstname: firstname,
                    lastname: lastname,
                    type: 4,
                    status: 0
                });
                User.createUser(newEmployee, function(err, companys) {
                    if (err) throw err;
                    res.send('ok');
                });
            }
        });
    }
});

module.exports = router;


