var express = require('express');
var router = express.Router();
var Admin = require('../models/admin');
const jwt = require('jsonwebtoken');

const { request } = require('express');
const accesskey = process.env.CVID_SECRET


router.post('/login', function (req, res, next) {
    Admin.getAdminByUsername(req.body.username, function (err, admin) {
        if (admin) {
            Admin.comparePassword(req.body.password, admin.password, function (err, isMatch) {
                if (err) res.json(500, err);
                else if (isMatch) {
                    var tokenss = jwt.sign({ id: admin._id, username: admin.username, status: admin.status, type: admin.type }, accesskey, {
                        algorithm: 'HS256',
                        expiresIn: 7760000
                    });
                    admin.password = '';
                    res.status(200).json({
                        "token": tokenss, userinfo: admin
                    })
                } else {
                    return res.json(401, 'Sai mật khẩu')
                }
            });
        }
        else {
            res.json(404, 'Tài khoản không tồn tại')
        }
    })
});

module.exports = router;