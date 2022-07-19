var express = require('express');
var router = express.Router();
var cors = require('cors')
var Business = require('../models/business');
const jwt = require('jsonwebtoken');
const accesskey = process.env.CVID_SECRET

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;



passport.use(new LocalStrategy(
  function(username, password, done) {
    Business.getBusinessByUsername(username, function(err, users){
   	if(err) throw err;
   	if(!users){
   		return done(null, false, {message: 'Unknown User'});
   	}
   	Business.comparePassword(password, users.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, users);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
}));

passport.serializeUser(function(users, done) {
  done(null, users.id);
});
passport.deserializeUser(function(id, done) {
    Business.getBusinessById(id, function(err, users) {
    done(err, users);
  });
});
router.post('/login', function(req, res, next) {
	Business.getBusinessByUsername(req.body.username, function(err, users) {
		if(users){
			passport.authenticate('local', function(err, user, info) {
				if (err ||!user) { return res.status(401).json({"code": 401,"massage":"Sai mật khẩu"}) }
				if (user.status == 0) { return res.status(401).json({"code": 401,"massage":"Tài khoản của bạn chưa được xác thực"}) }
				
				var tokenss = jwt.sign({id:user._id,username:req.body.username,status:user.status,type:user.type},accesskey,{
					algorithm: 'HS256',
					expiresIn: 7760000
				});
				user.password = '';
				res.status(200).json({
					"token":tokenss,userinfo:user
				})
				
			})(req, res, next);
				
		}
		else{
			res.status(404).json({
				"code": 404,
				"massage":"Tài khoản không tồn tại"
			})
		}
	});
});
router.post('/register', function(req, res){
    var type = req.body.type;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var country = req.body.country;
    var province = req.body.province;
    var district =  req.body.district;
    var ward = req.body.ward;
    var address = req.body.address;
    var majors = req.body.majors;
    // Validation
    req.checkBody('email', 'Chưa nhập email').notEmpty();
    req.checkBody('email', 'Email không hợp lệ').isEmail();
    req.checkBody('password', 'Chưa nhập mật khẩu').notEmpty();
    req.checkBody('password', 'Mật khẩu phải có ít nhất 6 ký tự').isLength({min: 6});
    req.checkBody('password2', 'Các mật khẩu đã nhập không khớp').equals(req.body.password);
    req.checkBody('name', 'Chưa nhập tên doanh nghiệp').notEmpty();
    req.checkBody('username', 'Chưa nhập mã số thuế hoặc số điện thoại').notEmpty();
    req.checkBody('username', 'mã số thuế hoặc số điện thoại có ít nhất 10 kí tự').isLength({min: 10});
    req.checkBody('province', 'Chưa chọn Tỉnh/Thành Phố').notEmpty();
    req.checkBody('district', 'Chưa chọn Quận/Huyện').notEmpty();
    req.checkBody('majors', 'Chưa chọn nghành nghề kinh doanh').notEmpty();
    req.checkBody('address', 'Chưa nhập địa chỉ').notEmpty();
    

    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
    } else {

        Business.getBusinessByEmail(email, function(err, user){
			if(err) throw err;
			if(user){
                res.send([{param: 'email', msg: 'Email đã được đăng kí', value: email}]);
			} else{
                var newBusiness = '';
                if (type == 5){
                    newBusiness = new Business({
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
                        majors: majors,
                        type: 5,
                        status: 1
                    });
                }
                else {
                    newBusiness = new Business({
                        username: username,
                        email: email,
                        password: password,
                        address: address,
                        country: country,
                        province: province,
                        district: district,
                        ward: ward,
                        majors: majors,
                        type: 6,
                        status: 0
                    });
                }
                
                Business.createBusiness(newBusiness, function(err, companys) {
                    if (err) throw err;
                    res.send('ok');
                });
            }
        });    
    }
});

module.exports = router;
