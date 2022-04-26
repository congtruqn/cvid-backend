var express = require('express');
var app = express();
var router = express.Router();
var cors = require('cors')
var employee = require('../models/employee');

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
        employee.checkEmail(email, function(err, user){
			if(err) throw err;
			if(user){
                res.send([{param: 'email', msg: 'Email is already registered', value: email}]);
			} else{
                var newEmployee = new employee({
                    email: email,
                    password: password,
                    firstname: firstname,
                    lastname: lastname,
                    type: 4,
                    status: 0
                });
                employee.createEmployee(newEmployee, function(err, companys) {
                    if (err) throw err;
                    res.send('ok');
                });
            }
        });
    }
});

module.exports = router;


