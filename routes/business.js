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
        var major = req.body.majors[i][0];
        var skill = req.body.majors[i][1];
        var found = majors.find(function(element){
            return element.name == major;
        })
        if (found) {
            found.skills.push({name:skill});
        } else {
            majors.push({
                name: major,
                skills: [{name: skill}]
            })
        }
    }

    // Validation
    req.checkBody('email', 'Chưa nhập email').notEmpty();
    req.checkBody('email', 'Email không hợp lệ').isEmail();
    req.checkBody('password', 'Chưa nhập mật khẩu').notEmpty();
    req.checkBody('password2', 'Các mật khẩu đã nhập không khớp').equals(req.body.password);
    req.checkBody('name', 'Chưa nhập tên doanh nghiệp').notEmpty();
    req.checkBody('MST', 'Chưa nhập mã số thuế').notEmpty();
    req.checkBody('MST', 'Mã số thuế có ít nhất 10 kí tự').isLength({min: 10});
    req.checkBody('province', 'Chưa chọn Tỉnh/Thành Phố').notEmpty();
    req.checkBody('district', 'Chưa chọn Quận/Huyện').notEmpty();
    req.checkBody('majors', 'Chưa chọn nghành nghề kinh doanh').notEmpty();
    

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
