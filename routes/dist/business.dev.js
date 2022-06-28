"use strict";

var express = require('express');

var router = express.Router();

var cors = require('cors');

var User = require('../models/register');

router.post('/register', function (req, res) {
  var type = req.body.type;
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var country = req.body.country;
  var province = req.body.province;
  var district = req.body.district;
  var ward = req.body.ward;
  var address = req.body.address;
  var major = req.body.major; // Validation

  req.checkBody('email', 'Chưa nhập email').notEmpty();
  req.checkBody('email', 'Email không hợp lệ').isEmail();
  req.checkBody('password', 'Chưa nhập mật khẩu').notEmpty();
  req.checkBody('password', 'Mật khẩu phải có ít nhất 6 ký tự').isLength({
    min: 6
  });
  req.checkBody('password2', 'Các mật khẩu đã nhập không khớp').equals(req.body.password);
  req.checkBody('name', 'Chưa nhập tên doanh nghiệp').notEmpty();
  req.checkBody('username', 'Chưa nhập mã số thuế hoặc số điện thoại').notEmpty();
  req.checkBody('username', 'mã số thuế hoặc số điện thoại có ít nhất 10 kí tự').isLength({
    min: 10
  });
  req.checkBody('province', 'Chưa chọn Tỉnh/Thành Phố').notEmpty();
  req.checkBody('district', 'Chưa chọn Quận/Huyện').notEmpty();
  req.checkBody('major', 'Chưa chọn nghành nghề kinh doanh').notEmpty();
  req.checkBody('address', 'Chưa nhập địa chỉ').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    res.send(errors);
  } else {
    User.getUserByEmail(email, function (err, user) {
      if (err) throw err;

      if (user) {
        res.send([{
          param: 'email',
          msg: 'Email đã được đăng kí',
          value: email
        }]);
      } else {
        var newBusiness = '';

        if (type == 5) {
          newBusiness = new User({
            name: req.body.name,
            nameforeign: req.body.nameforeign,
            nameacronym: req.body.nameacronym,
            username: username,
            email: email,
            password: password,
            address: address,
            country: country,
            province: province,
            district: district,
            ward: ward,
            major: major,
            type: 5,
            status: 0
          });
        } else {
          newBusiness = new User({
            username: username,
            email: email,
            password: password,
            address: address,
            country: country,
            province: province,
            district: district,
            ward: ward,
            major: major,
            type: 6,
            status: 0
          });
        }

        User.createUser(newBusiness, function (err, companys) {
          if (err) throw err;
          res.send('ok');
        });
      }
    });
  }
});
module.exports = router;