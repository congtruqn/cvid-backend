var express = require('express');
var router = express.Router();
var cors = require('cors')
var Employee = require('../models/employee');
var Department = require('../models/department');
var authmodel = require('../models/auth');
const jwt = require('jsonwebtoken');
const accesskey = process.env.CVID_SECRET

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function (username, password, done) {
        Employee.getEmployeeByUsername(username, function (err, users) {
            if (err) throw err;
            if (!users) {
                return done(null, false, { message: 'Unknown User' });
            }
            Employee.comparePassword(password, users.password, function (err, isMatch) {
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

router.post('/register', function (req, res) {
    var name = req.body.name;
    var username = req.body.username;
    var birthdate = req.body.birthdate;
    var email = req.body.email;
    var gender = req.body.gender;
    var country = req.body.country;
    var province = req.body.province;
    var district = req.body.district;
    var ward = req.body.ward;
    var address = req.body.address;
    var level = req.body.level;
    var school = req.body.school;
    var skill = req.body.skill;
    var startyear = req.body.startyear;
    var endyear = req.body.endyear;
    var professionaltitle = req.body.professionaltitle;
    var password = req.body.password;

    Employee.getEmployeeByUsername(username, function (err, user) {
        if (err) throw err;
        if (user) {
            res.send([{ param: 'username', msg: 'Số điện thoại đã được sử dụng', value: username }]);
        } else {
            Employee.getEmployeeByEmail(email, function (err, user) {
                if (err) throw err;
                if (user) {
                    res.send([{ param: 'email', msg: 'Email đã được sử dụng', value: email }]);
                } else {
                    var newEmployee = new Employee({
                        name: name,
                        username: username,
                        birthdate: birthdate,
                        email: email,
                        gender: gender,
                        country: country, 
                        province: province,
                        district: district,
                        ward: ward,
                        address: address,
                        level: level,
                        school: school,
                        startyear: startyear,
                        endyear: endyear,
                        skill: skill,
                        professionaltitle: professionaltitle,
                        password: password,
                        status: 1
                    });
                    Employee.createEmployee(newEmployee, function (err, companys) {
                        if (err) console.log(err);
                        else res.send('ok');
                    });
                }
            });
        }
    })
});

router.get('/me', authmodel.checkLogin, function (req, res) {
    let id = req.user;
    Employee.getEmployeeById(id, function (err, user) {
        if (err) {
            res.status(500).json(err)
        } else if (!user) {
            res.status(404).json('No user found.');
        } else {
            res.status(200).json(user);
        }
    });
});

router.post('/createCV', function (req, res) {
    var id = req.body.id;
    var skillWorking = req.body.skillWorking
    var skillEducation = req.body.skillEducation
    var shortTraining = req.body.shortTraining
    var skillEnglish = req.body.skillEnglish
    var skillLanguage = req.body.skillLanguage
    var skillComputer = req.body.skillComputer
    var skillOther = req.body.skillOther
    var assessment = req.body.assessment
    var image = req.body.image
    var sumAssessment = assessment.reduce(function (a, b) { return parseInt(a) + parseInt(b); }, 0);
    var point = Math.round(sumAssessment * 10 / assessment.length) / 10

    var newCV = {
        skillWorking: skillWorking,
        skillEducation: skillEducation,
        shortTraining: shortTraining,
        skillEnglish: skillEnglish,
        skillLanguage: skillLanguage,
        skillComputer: skillComputer,
        skillOther: skillOther,
        assessment: assessment,
        image: image,
        point: point,
        approved: 0
    };

    Employee.createCV(id, newCV, function (err, resume) {
        if (err) {
            res.json(500, err);
        } else if (resume) {
            res.json(resume)
        } else {
            res.json(404, 'Error 404')
        }
    });


});

router.get('/cvid/:id', function (req, res) {
    Employee.getEmployeeById(req.params.id, function (err, cv) {
        if (err) {
            res.json(err);
        } else {
            cv.password = undefined;
            res.json(cv)
        }
    });
})

router.get('/getall', authmodel.checkAdmin, function (req, res, next) {
    Employee.getAllEmployee(function (err, employees) {
        if (err) res.json(500, err)
        else {
            res.json(200, employees)
        }
    })
});

router.post('/list/cvid', function (req, res) {
    var selected = req.body.selected;
    Employee.getEmployeeByListId(selected, function (err, list_cvid) {
        if (err) {
            res.json(err);
        } else {
            res.json(list_cvid)
        }
    });
})
router.post('/findPosition', function (req, res) {
    var condition = {
        skill: req.body.skill
    }
    Department.getPosition(condition, function (err, position) {
        res.json(position)
    });
})

router.get('/not-browse-cvid/:id', authmodel.checkAdmin, function (req, res) {
    var noteCV = req.body.noteCV
    Employee.notBrowseCV(req.params.id, noteCV, function (err, result) {
        if (err) {
            res.status(500).json(err)
        } else {
            res.status(200).json(result)
        }
    });
})

router.get('/browse-cvid1/:id', authmodel.checkAdmin, function (req, res) {
    Employee.browseCV1(req.params.id, function (err, result) {
        if (err) {
            res.status(500).json(err)
        } else {
            res.status(200).json(result)
        }
    });
})

router.get('/delete/:id', authmodel.checkAdmin, function (req, res) {
    Employee.deleteEmployeeById(req.params.id, function (err, result) {
        if (err) {
            res.status(500).json(err)
        } else {
            res.status(200).json(result)
        }
    });
})

router.get('/browse-cvid2/:id', authmodel.checkAdmin, function (req, res) {
    Employee.browseCV2(req.params.id, function (err, result) {
        if (err) {
            res.status(500).json(err)
        } else {
            res.status(200).json(result)
        }
    });
})

router.get('/cancel-browse-cvid/:id', authmodel.checkAdmin, function (req, res) {
    Employee.cancelBrowseCV(req.params.id, function (err, result) {
        if (err) {
            res.status(500).json(err)
        } else {
            res.status(200).json(result)
        }
    });
})

router.post('/findJob', function (req, res) {
    var id = req.body.id
    var job = req.body.job
    job.datetime = new Date()

    Employee.findJob(id, { job: job }, function (err, employee) {
        if (err) {
            res.json(500, err);
            return
        } else if (!employee) {
            res.json(404, 'Error 404')
            return
        }
    })
    Department.getPosition(job, function (err, departments) {
        if (err) res.json(500, err)
        else {
            var result = []
            departments.forEach(department => {
                department.position.forEach(item => {
                    let flag = true
                    if (job.work_industry != '' && job.work_industry != item.work_industry && item.work_industry != '') {
                        flag = false
                    }
                    if (job.position != [] && !job.position.includes(item.name) && item.name != '') {
                        flag = false
                    }
                    if (job.work_environment != [] && !job.work_environment.includes(item.work_environment) && item.work_environment != '') {
                        flag = false
                    }
                    if (job.address != '' && job.address != item.work_location) {
                        flag = false
                    }
                    if (item.skills.includes(job.skill) && item.status == 1 && flag == true && item.jobtitle == job.jobtitle) {
                        result.push(item)
                    }
                })
            })
            if (job.status == 0) {
                res.json([])
            } else {
                res.json(result)
            }

        }
    });
})

module.exports = router;


