var express = require('express');
var router = express.Router();
var cors = require('cors')
var User = require('../models/register');

router.post('/register', function(req, res){

    var name = req.body.name;
    var MST = req.body.MST;
    var email = req.body.email;
    var password = req.body.password;
    var province = {
        Id : req.body.province[0],
        Name : req.body.province[1]
    }
    var district = {
        Id : req.body.district[0],
        Name : req.body.district[1]
    }
    var major = req.body.major;
    var address = req.body.address;

    // Validation
    req.checkBody('email', 'Chưa nhập email').notEmpty();
    req.checkBody('email', 'Email không hợp lệ').isEmail();
    req.checkBody('password', 'Chưa nhập mật khẩu').notEmpty();
    req.checkBody('password', 'Mật khẩu phải có ít nhất 6 ký tự').isLength({min: 6});
    req.checkBody('password2', 'Các mật khẩu đã nhập không khớp').equals(req.body.password);
    req.checkBody('name', 'Chưa nhập tên doanh nghiệp').notEmpty();
    req.checkBody('MST', 'Chưa nhập mã số thuế').notEmpty();
    req.checkBody('MST', 'Mã số thuế có ít nhất 10 kí tự').isLength({min: 10});
    req.checkBody('province', 'Chưa chọn Tỉnh/Thành Phố').notEmpty();
    req.checkBody('district', 'Chưa chọn Quận/Huyện').notEmpty();
    req.checkBody('major', 'Chưa chọn nghành nghề kinh doanh').notEmpty();
    req.checkBody('address', 'Chưa nhập địa chỉ').notEmpty();
    

    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
    } else {

        User.getUserByEmail(email, function(err, user){
			if(err) throw err;
			if(user){
                res.send([{param: 'email', msg: 'Email đã được đăng kí', value: email}]);
			} else{
                var newBusiness = new User({
                    name: name,
                    username: MST,
                    email: email,
                    password: password,
                    address: address,
                    province: province,
                    district: district,
                    major: major,
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
