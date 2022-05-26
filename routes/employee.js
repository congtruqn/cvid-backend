var express = require('express');
var router = express.Router();
var cors = require('cors')
var User = require('../models/register');

router.post('/register', function(req, res){
    var name = req.body.name;
    var username = req.body.username;
    var birthdate = req.body.birthdate;
    var email = req.body.email;
    var province = {
        Id : req.body.province[0],
        Name : req.body.province[1]
    }
    var district = {
        Id : req.body.district[0],
        Name : req.body.district[1]
    }
    var address = req.body.address;
    var level = req.body.level;
    var major = req.body.major;
    var skill = req.body.skill;
    var password = req.body.password;
    console.log(req.body);
    // Validation
    req.checkBody('name', 'Chưa nhập Họ và tên').notEmpty();
    req.checkBody('username', 'Chưa nhập số CCCD/Hộ chiếu').notEmpty();
    req.checkBody('username', 'Số CCCD/Hộ chiếu không hợp lệ').isLength({min: 9});
    req.checkBody('birthdate', 'Chưa nhập ngày sinh').notEmpty();
    req.checkBody('email', 'Chưa nhập email').notEmpty();
    req.checkBody('email', 'Email không hợp lệ').isEmail();
    req.checkBody('province', 'Chưa chọn Tỉnh/Thành Phố').notEmpty();
    req.checkBody('district', 'Chưa chọn Quận/Huyện').notEmpty();
    req.checkBody('address', 'Chưa nhập địa chỉ').notEmpty();
    req.checkBody('level', 'Chưa chọn cấp bậc').notEmpty();
    req.checkBody('major', 'Chưa chọn ngành nghề').notEmpty();
    req.checkBody('skill', 'Chưa chọn chuyên nghành').notEmpty();
    req.checkBody('password', 'Chưa nhập mật khẩu').notEmpty();
    req.checkBody('password', 'Mật khẩu phải có ít nhất 6 ký tự').isLength({min: 6});
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
                    name: name,
                    username: username,
                    birthdate: birthdate,
                    email: email,
                    province: province,
                    district: district,
                    address: address,
                    level: level,
                    major: major,
                    skill: skill,
                    password: password,
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

router.post('/getinfo', function(req, res){
    User.getUserById(req.body.id, function(err, user){
        if(err) throw err;
        if(user){
            res.send(user);
        } else{
            res.send('error');
        }
    });
});

module.exports = router;


