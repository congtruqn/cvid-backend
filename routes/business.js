var express = require('express');
var router = express.Router();
var cors = require('cors')
var Business = require('../models/business');
var authmodel = require('../models/auth');
const jwt = require('jsonwebtoken');
const accesskey = process.env.CVID_SECRET
const request = require('request')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function (username, password, done) {
        Business.getBusinessByUsername(username, function (err, users) {
            if (err) throw err;
            if (!users) {
                return done(null, false, { message: 'Unknown User' });
            }
            Business.comparePassword(password, users.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, users);
                } else {
                    return done(null, false, { message: 'Invalid password' });
                }
            });
        });
    }));

passport.serializeUser(function (users, done) {
    done(null, users.id);
});
passport.deserializeUser(function (id, done) {
    Business.getBusinessById(id, function (err, users) {
        done(err, users);
    });
});
router.post('/login', function (req, res, next) {
    Business.getBusinessByUsername(req.body.username, function (err, users) {
        if (users) {
            Business.comparePassword(req.body.password, users.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    if (users.status == 0) { return res.status(401).json({ "code": 401, "massage": "Tài khoản của bạn chưa được xác thực" }) }

                    var tokenss = jwt.sign({ id: users._id, username: req.body.username, status: users.status, type: users.type }, accesskey, {
                        algorithm: 'HS256',
                        expiresIn: 7760000
                    });
                    users.password = '';
                    res.status(200).json({
                        "token": tokenss, userinfo: users
                    })
                } else {
                    return res.status(401).json({ "code": 401, "massage": "Sai mật khẩu" })
                }
            });


        }
        else {
            res.status(404).json({
                "code": 404,
                "massage": "Tài khoản không tồn tại"
            })
        }
    });
});
router.post('/register', function (req, res, next) {
    var type = req.body.type;
    var username = req.body.username;
    var phone = req.body.phone;
    var name = req.body.name;
    var manager = req.body.manager;
    var position = req.body.position;
    var email = req.body.email;
    var password = req.body.password;
    var country = req.body.country;
    var province = req.body.province;
    var district = req.body.district;
    var ward = req.body.ward;
    var address = req.body.address;
    var majors = req.body.majors;
    var urlGPKD =req.body.image;
    // Validation
    req.checkBody('email', 'Chưa nhập email').notEmpty();
    req.checkBody('email', 'Email không hợp lệ').isEmail();
    req.checkBody('password', 'Chưa nhập mật khẩu').notEmpty();
    req.checkBody('password2', 'Các mật khẩu đã nhập không khớp').equals(req.body.password);
    req.checkBody('name', 'Chưa nhập tên doanh nghiệp').notEmpty();
    req.checkBody('username', 'Chưa nhập mã số thuế hoặc số điện thoại').notEmpty();
    req.checkBody('province', 'Chưa chọn Tỉnh/Thành Phố').notEmpty();
    req.checkBody('district', 'Chưa chọn Quận/Huyện').notEmpty();
    req.checkBody('ward', 'Chưa chọn Phường/Xã').notEmpty();
    req.checkBody('industries', 'Chưa chọn lĩnh vực kinh doanh').notEmpty();
    req.checkBody('address', 'Chưa nhập địa chỉ').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
    } else {

        Business.getBusinessByEmail(email, function (err, user) {
            if (err) throw err;
            if (user) {
                res.send([{ param: 'email', msg: 'Email đã được đăng kí', value: email }]);
            } else {
                var newBusiness = '';
                if (type == 5) {
                    newBusiness = new Business({
                        name: req.body.name,
                        username: username,
                        email: email,
                        password: password,
                        address: address,
                        country: country,
                        province: province,
                        district: district,
                        ward: ward,
                        majors: majors,
                        urlGPKD: urlGPKD,
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
                Business.createBusiness(newBusiness, function (err, companys) {
                    if (err) throw err;
                    res.send('ok');
                });
            }
        });
    }
});

router.post('/getinfo', function (req, res) {
    var mst = req.body.mst;
    var uri = "https://www.tratencongty.com/search/" + mst
    request(uri, function (error, response, body) {
        if (error) {
            console.log(error)
        }
        else {
            res.send(body)
        }
    })
});

router.get('/getall', authmodel.checkAdmin, function (req, res, next) {
    Business.getAllBusiness(function (err, businesses) {
        if (err) res.json(500, err)
        else {
            res.json(200, businesses)
        }
    })
});

router.get('/browse-GPKD1/:id', authmodel.checkAdmin, function (req, res) {
    Business.browseGPKD1(req.params.id, function (err, result) {
        if (err) {
            res.status(500).json(err)
        } else {
            res.status(200).json(result)
        }
    });
})
router.get('/browse-GPKD2/:id', authmodel.checkAdmin, function (req, res) {
    Business.browseGPKD2(req.params.id, function (err, result) {
        if (err) {
            res.status(500).json(err)
        } else {
            res.status(200).json(result)
        }
    });
})
router.get('/cancel-browse-GPKD/:id', authmodel.checkAdmin, function (req, res) {
    Business.cancelBrowse(req.params.id, function (err, result) {
        if (err) {
            res.status(500).json(err)
        } else {
            res.status(200).json(result)
        }
    });
})
router.get('/not-browse-GPKD/:id', authmodel.checkAdmin, function (req, res) {
    Business.notbrowseGPKD(req.params.id, function (err, result) {
        if (err) {
            res.status(500).json(err)
        } else {
            res.status(200).json(result)
        }
    });
})

router.get('/delete/:id', authmodel.checkAdmin, function (req, res) {
    Business.deleteBusiness(req.params.id, function (err, result) {
        if (err) {
            res.status(500).json(err)
        } else {
            res.status(200).json(result)
        }
    });
})


module.exports = router;
