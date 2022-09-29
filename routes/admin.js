var express = require('express');
var router = express.Router();
var Admin = require('../models/admin');
var Employee = require('../models/employee');
var Business = require('../models/business');
const jwt = require('jsonwebtoken');

const { request } = require('express');
const accesskey = process.env.CVID_SECRET

var checkAdmin = (req, res, next) => {
    var token = req.body.token
    if (token) {
        jwt.verify(token, accesskey, function (err, decoded) {
            if (err) {
                res.redirect("/admin/login")
            }
            else {
                id = decoded.id;
                Admin.getAdminById(id, function (err, admin) {
                    if (err) {
                        res.send(500, err);
                    } else if (!admin) {
                        res.redirect("/admin/login")
                    } else {
                        req.data = admin;
                        next();
                    }
                });
            }
        });
    }
    else {
        res.redirect("/admin/login")
    }
}

/* GET home page. */
router.post('/get-all-employee', checkAdmin, function (req, res, next) {
    Employee.getAllEmployee(function (err, employees) {
        if (err) res.json(500, err)
        else {
            res.json(200, employees)
        }
    })
});
router.post('/delete-employee-by-id', checkAdmin, function (req, res, next) {
    Employee.deleteEmployeeById(req.body.id, function (err, employee) {
        if (err) res.json(500, err)
        else {
            res.json(200, employee)
        }
    })
});
router.post('/get-all-business', checkAdmin, function (req, res, next) {
    Business.getAllBusiness(function (err, businesses) {
        if (err) res.json(500, err)
        else {
            res.json(200, businesses)
        }
    })
});

router.post('/login', function (req, res, next) {
    Admin.getAdminByUsername(req.body.username, function (err, admin) {
        if (admin) {
            Admin.comparePassword(req.body.password, admin.password, function (err, isMatch) {
                if (err) res.json(500, err);
                else if (isMatch) {
                    var tokenss = jwt.sign({ id: admin._id, username: admin.username, status: admin.status }, accesskey, {
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

router.get('/test', function (req, res, next) {
    const request = require('request')
    function doRequest(url) {
        return new Promise(function (resolve, reject) {
            request(url, function (error, res, body) {
                if (!error && res.statusCode === 200) {
                    resolve(body);
                } else {
                    reject(error);
                }
            });
        });
    }
    async function getPosition() {
        var kq = new Array()
        for (let i = 1; i < 3; i++) {
            var url = "https://www.vietnamworks.com/tim-viec-lam/tat-ca-viec-lam?page=" + i
            try {
                let response = await doRequest(url);
                kq.push(response)
            } catch (error) {
                console.error(error);
            }
        }
        console.log(kq)
        res.json(kq)
    }
    getPosition()
    // request(uri, function(error, response, body) {
    //     if (error){
    //         console.log(error)
    //     }
    //     else {
    //         res.send(body)
    //     }
    // })
});
module.exports = router;