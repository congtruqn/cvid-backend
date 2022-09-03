"use strict";

var express = require('express');

var router = express.Router();

var cors = require('cors');

var Employee = require('../models/employee');

var Department = require('../models/department');

var Major = require('../models/major');

var jwt = require('jsonwebtoken');

var accesskey = process.env.CVID_SECRET;

var passport = require('passport');

var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(function (username, password, done) {
  Employee.getEmployeeByUsername(username, function (err, users) {
    if (err) throw err;

    if (!users) {
      return done(null, false, {
        message: 'Unknown User'
      });
    }

    Employee.comparePassword(password, users.password, function (err, isMatch) {
      if (err) throw err;

      if (isMatch) {
        return done(null, users);
      } else {
        return done(null, false, {
          message: 'Invalid password'
        });
      }
    });
  });
}));
passport.serializeUser(function (users, done) {
  done(null, users._id);
});
passport.deserializeUser(function (id, done) {
  Employee.getEmployeeById(id, function (err, users) {
    done(err, users);
  });
});
router.post('/login', function (req, res, next) {
  Employee.getEmployeeByUsername(req.body.username, function (err, users) {
    if (users) {
      Employee.comparePassword(req.body.password, users.password, function (err, isMatch) {
        if (err) throw err;

        if (isMatch) {
          if (users.status == 0) {
            return res.status(401).json({
              "code": 401,
              "massage": "Tài khoản của bạn chưa được xác thực"
            });
          }

          var tokenss = jwt.sign({
            id: users._id,
            username: req.body.username,
            status: users.status,
            type: users.type
          }, accesskey, {
            algorithm: 'HS256',
            expiresIn: 7760000
          });
          users.password = '';
          res.status(200).json({
            "token": tokenss,
            userinfo: users
          });
        } else {
          return res.status(401).json({
            "code": 401,
            "massage": "Sai mật khẩu"
          });
        }
      });
    } else {
      res.status(404).json({
        "code": 404,
        "massage": "Tài khoản không tồn tại"
      });
    }
  });
});
router.post('/register', function (req, res) {
  var name = req.body.name;
  var username = req.body.username;
  var birthdate = req.body.birthdate;
  var email = req.body.email;
  var country = req.body.country;
  var province = req.body.province;
  var district = req.body.district;
  var ward = req.body.ward;
  var address = req.body.address;
  var level = req.body.level;
  var school = req.body.school;
  var major = req.body.major;
  var skill = req.body.skill;
  var startyear = req.body.startyear;
  var endyear = req.body.endyear;
  var position = req.body.position;
  var password = req.body.password; // Validation

  req.checkBody('name', 'Chưa nhập Họ và tên').notEmpty();
  req.checkBody('username', 'Chưa nhập số điện thoại').notEmpty();
  req.checkBody('username', 'Số điện thoại không hợp lệ').isLength({
    min: 9
  });
  req.checkBody('birthdate', 'Chưa nhập ngày sinh').notEmpty();
  req.checkBody('email', 'Chưa nhập email').notEmpty();
  req.checkBody('email', 'Email không hợp lệ').isEmail();
  req.checkBody('level', 'Chưa chọn cấp bậc').notEmpty();
  req.checkBody('school', 'Chưa chọn trường').notEmpty();
  req.checkBody('major', 'Chưa chọn ngành nghề').notEmpty();
  req.checkBody('skill', 'Chưa chọn chuyên nghành').notEmpty();
  req.checkBody('position', 'Chưa chọn chức danh').notEmpty();
  req.checkBody('country', 'Chưa chọn Quốc gia').notEmpty();
  req.checkBody('province', 'Chưa chọn Tỉnh/Thành Phố').notEmpty();
  req.checkBody('district', 'Chưa chọn Quận/Huyện').notEmpty();
  req.checkBody('ward', 'Chưa chọn Phường/Xã').notEmpty();
  req.checkBody('address', 'Chưa nhập địa chỉ').notEmpty();
  req.checkBody('password', 'Chưa nhập mật khẩu').notEmpty();
  req.checkBody('password', 'Mật khẩu phải có ít nhất 6 ký tự').isLength({
    min: 6
  });
  req.checkBody('password2', 'Các mật khẩu đã nhập không khớp').equals(req.body.password);
  var errors = req.validationErrors();

  if (errors) {
    res.send(errors);
  } else {
    Employee.getEmployeeByUsername(username, function (err, user) {
      if (err) throw err;

      if (user) {
        res.send([{
          param: 'username',
          msg: 'CVID đã được sử dụng',
          value: username
        }]);
      } else {
        Employee.getEmployeeByEmail(email, function (err, user) {
          if (err) throw err;

          if (user) {
            res.send([{
              param: 'email',
              msg: 'Email đã được đăng kí',
              value: email
            }]);
          } else {
            var newEmployee = new Employee({
              name: name,
              username: username,
              birthdate: birthdate,
              email: email,
              country: country,
              province: province,
              district: district,
              ward: ward,
              address: address,
              level: level,
              school: school,
              startyear: startyear,
              endyear: endyear,
              major: major,
              skill: skill,
              position: position,
              password: password,
              status: 1
            });
            Employee.createEmployee(newEmployee, function (err, companys) {
              if (err) throw err;
              Major.addPosition(major, position, function (err, result) {
                res.send('ok');
              });
            });
          }
        });
      }
    });
  }
});
router.post('/me', function (req, res) {
  var token = req.body.token;

  if (token) {
    jwt.verify(token, accesskey, function (err, decoded) {
      if (err) {
        res.json(401, err);
      } else {
        id = decoded.id;
        Employee.getEmployeeById(id, function (err, user) {
          if (err) {
            res.json({
              code: 500,
              massage: 'Internal Server Error'
            });
          } else if (!user) {
            res.json({
              code: 404,
              message: 'No user found.'
            });
          } else {
            res.json(200, {
              user: user
            });
          }
        });
      }
    });
  } else {
    res.json({
      code: 404,
      message: 'No token found'
    });
  }
});
router.post('/createCV', function (req, res) {
  var id = req.body.id;
  var skillWorking = req.body.skillWorking;
  var skillEducation = req.body.skillEducation;
  var shortTraining = req.body.shortTraining;
  var skillEnglish = req.body.skillEnglish;
  var skillLanguage = req.body.skillLanguage;
  var skillComputer = req.body.skillComputer;
  var skillOther = req.body.skillOther;
  var assessment = req.body.assessment;
  var sumAssessment = assessment.reduce(function (a, b) {
    return parseInt(a) + parseInt(b);
  }, 0);
  var point = Math.round(sumAssessment * 10 / 16) / 10;
  var newCV = {
    skillWorking: skillWorking,
    skillEducation: skillEducation,
    shortTraining: shortTraining,
    skillEnglish: skillEnglish,
    skillLanguage: skillLanguage,
    skillComputer: skillComputer,
    skillOther: skillOther,
    assessment: assessment,
    point: point
  };
  Employee.createCV(id, newCV, function (err, resume) {
    if (err) {
      res.json(500, err);
    } else if (resume) {
      res.json(resume);
    } else {
      res.json(404, 'Error 404');
    }
  });
});
router.get('/cvid/:id', function (req, res) {
  Employee.getEmployeeById(req.params.id, function (err, cv) {
    if (err) {
      res.json(err);
    } else {
      cv.password = undefined;
      res.json(cv);
    }
  });
});
router.post('/list/cvid', function (req, res) {
  var selected = req.body.selected;
  Employee.getEmployeeByListId(selected, function (err, list_cvid) {
    if (err) {
      res.json(err);
    } else {
      res.json(list_cvid);
    }
  });
});
router.post('/findPosition', function (req, res) {
  var condition = {
    skill: req.body.skill
  };
  Department.getPosition(condition, function (err, position) {
    res.json(position);
  });
});
router.post('/findJob', function (req, res) {
  var id = req.body.id;
  var job = req.body.job;
  job.datetime = new Date();
  Employee.findJob(id, {
    job: job
  }, function (err, employee) {
    if (err) {
      res.json(500, err);
      return;
    } else if (!employee) {
      res.json(404, 'Error 404');
      return;
    }
  });
  Department.getPosition(job, function (err, departments) {
    if (err) res.json(500, err);else {
      var result = [];
      departments.forEach(function (department) {
        department.position.forEach(function (item) {
          if (item.skills.includes(job.skill) && item.status == 1) {
            result.push(item);
          }
        });
      });
      res.json(result);
    }
  });
});
module.exports = router;