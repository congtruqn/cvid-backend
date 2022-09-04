"use strict";

var express = require('express');

var router = express.Router();

var Admin = require('../models/admin');

var Employee = require('../models/employee');

var jwt = require('jsonwebtoken');

var accesskey = process.env.CVID_SECRET;

var checkAdmin = function checkAdmin(req, res, next) {
  var token = req.body.token;

  if (token) {
    jwt.verify(token, accesskey, function (err, decoded) {
      if (err) {
        res.json(401, 'Failed to authenticate token.');
      } else {
        id = decoded.id;
        Admin.getAdminById(id, function (err, admin) {
          if (err) {
            res.send(500, err);
          } else if (!admin) {
            res.send(404, 'No admin found.');
          } else {
            req.data = admin;
            next();
          }
        });
      }
    });
  } else {
    res.json(404, 'No token provided.');
  }
};
/* GET home page. */


router.post('/get-all-employee', checkAdmin, function (req, res, next) {
  Employee.getAllEmployee(function (err, employees) {
    if (err) res.json(500, err);else {
      res.json(200, employees);
    }
  });
});
router.post('/login', function (req, res, next) {
  Admin.getAdminByUsername(req.body.username, function (err, admin) {
    if (admin) {
      Admin.comparePassword(req.body.password, admin.password, function (err, isMatch) {
        if (err) res.json(500, err);else if (isMatch) {
          var tokenss = jwt.sign({
            id: admin._id,
            username: admin.username,
            status: admin.status
          }, accesskey, {
            algorithm: 'HS256',
            expiresIn: 7760000
          });
          admin.password = '';
          res.status(200).json({
            "token": tokenss,
            userinfo: admin
          });
        } else {
          return res.json(401, 'Sai mật khẩu');
        }
      });
    } else {
      res.json(404, 'Tài khoản không tồn tại');
    }
  });
});
module.exports = router;