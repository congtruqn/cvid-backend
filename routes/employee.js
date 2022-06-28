var express = require('express');
var router = express.Router();
var cors = require('cors')
var User = require('../models/register');

router.post('/register', function(req, res){
    var name = req.body.name;
    var username = req.body.username;
    var birthdate = req.body.birthdate;
    var email = req.body.email;
    var province = req.body.province;
    var district = req.body.district;
    var ward = req.body.ward;
    var address = req.body.address;
    var level = req.body.level;
    var major = req.body.major;
    var skill = req.body.skill;
    var password = req.body.password;
    // Validation
    req.checkBody('name', 'Chưa nhập Họ và tên').notEmpty();
    req.checkBody('username', 'Chưa nhập số CCCD/Hộ chiếu').notEmpty();
    req.checkBody('username', 'Số CCCD/Hộ chiếu không hợp lệ').isLength({min: 9});
    req.checkBody('birthdate', 'Chưa nhập ngày sinh').notEmpty();
    req.checkBody('email', 'Chưa nhập email').notEmpty();
    req.checkBody('email', 'Email không hợp lệ').isEmail();
    req.checkBody('province', 'Chưa chọn Tỉnh/Thành Phố').notEmpty();
    req.checkBody('district', 'Chưa chọn Quận/Huyện').notEmpty();
    req.checkBody('ward', 'Chưa chọn Phường/Xã').notEmpty();
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
        User.getUserByUsername(username, function(err, user){
            if(err) throw err;
			if(user){
                res.send([{param: 'username', msg: 'CVID đã được sử dụng', value: username}]);
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
                            ward: ward,
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
        })
        
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

router.post('/createCV', function(req, res){
    var errors = []
    var id = req.body.id;
    var degrees = req.body.degrees;
    degrees = degrees.filter(function(item){
        if (item.name != ''){
            if (item.major == '' | item.school == '' | item.year == '' | item.code == ''){
                errors.push({
                    mes: "Điền đầy đủ thông tin của bằng cấp"
                })
            }
            return true
        }
    });
    var skills = req.body.skills
    skills = skills.filter(function(item){
        if (item.name != ''){
            if (item.school == '' | item.year == ''){
                errors.push({
                    mes: "Điền đầy đủ thông tin của kĩ năng"
                })
            }
            return true
        }
    });
    var companies = req.body.companies
    companies = companies.filter(function(companie){
        if (companie.name != ''){
            companie.position = companie.position.filter(function(item){
                if (item.work != ''){
                    if (item.from == '' | item.to == '' | item.năm == '' | item.address == ''){
                        errors.push({
                            mes: "Điền đầy đủ thông tin quá trình công tác"
                        })
                    }
                    return true
                }
            });
            if (!companie.position.length){
                errors.push({
                    mes: "Điền đầy đủ thông tin quá trình công tác"
                })
            } 
            return true
        }
    });
    var assessment = req.body.assessment
    var sumAssessment = assessment.reduce(function(a, b) { return parseInt(a) + parseInt(b); }, 0);
    var point = Math.round(sumAssessment * 10 / 21 ) / 10 

    var newResume = {
        degrees : degrees,
        skills : skills,
        companies : companies,
        assessment : assessment,
        point : point
    };
    if (errors.length){
        res.json({
            success: false,
            message: errors[0]?errors[0].mes:''
        })
    } else {
        User.createCV(id, newResume, function(err, resume) {
            if (err) {
                res.json(err);
            } else {
                res.json({
                    success: true,
                    message: "ok"
                });
            }
        });
    }
    
});

    
module.exports = router;


