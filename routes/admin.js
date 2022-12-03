var express = require("express");
var router = express.Router();
var Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
var authmodel = require("../models/auth");
const { request } = require("express");
const accesskey = process.env.CVID_SECRET;

router.post("/login", function (req, res, next) {
  Admin.getAdminByUsername(req.body.username, function (err, admin) {
    if (admin) {
      Admin.comparePassword(
        req.body.password,
        admin.password,
        function (err, isMatch) {
          if (err) res.json(500, err);
          else if (isMatch) {
            var tokenss = jwt.sign(
              {
                id: admin._id,
                username: admin.username,
                status: admin.status,
                type: admin.type,
              },
              accesskey,
              {
                algorithm: "HS256",
                expiresIn: 7760000,
              }
            );
            admin.password = "";
            res.status(200).json({
              token: tokenss,
              userinfo: admin,
            });
          } else {
            return res.json(401, "Sai mật khẩu");
          }
        }
      );
    } else {
      res.json(404, "Tài khoản không tồn tại");
    }
  });
});

router.post("/create", authmodel.checkAdmin, async function (req, res, next) {
  let { username, password, name, roles } = req.body;
  let admin = new Admin({
    username: username,
    password: password,
    name: name,
    roles: roles,
    type: 1,
    status: 1,
  });

  let findAdmin = await Admin.getAdminByUsername(username, (err, result) => {
    if (err) {
      return res.status(500).json(err.message);
    } else if (result) {
      return res.status(200).json({
        status: false,
        message: "Username đã tồn tại",
      });
    } else {
      Admin.createAdmin(admin, function (err, admin) {
        if (admin) {
          res.status(200).json({
            status: true,
            message: "Success",
          });
        } else if (err) {
          res.status(500).json(err.message);
        }
      });
    }
  });
});

module.exports = router;
