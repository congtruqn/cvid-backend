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
    req.checkBody('firstname', 'Chưa nhập Họ và Tên').notEmpty();
    req.checkBody('lastname', 'Chưa nhập Họ và Tên').notEmpty();
    req.checkBody('email', 'Chưa nhập email').notEmpty();
    req.checkBody('email', 'Email không hợp lệ').isEmail();
    req.checkBody('password', 'Chưa nhập mật khẩu').notEmpty();
    req.checkBody('password2', 'Các mật khẩu đã nhập không khớp').equals(req.body.password);
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
    } else {
        User.getUserByEmail(email, function(err, user){
			if(err) throw err;
			if(user){
                res.send([{param: 'email', msg: 'Email đã được đăng kí', value: email}]);
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


