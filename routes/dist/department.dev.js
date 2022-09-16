"use strict";

var express = require('express');

var router = express.Router();

var Department = require('../models/department');

var Employee = require('../models/employee');

var SendMail = require('../models/send-mail');

var uuid = require("uuid");

router.post('/new', function (req, res) {
  var name = req.body.name;
  var id = req.body.id;
  var email = req.body.email;
  var key = uuid.v4();
  var newDepartment = new Department({
    name: name,
    id: id,
    email: email,
    key: key
  });
  Department.createDepartment(newDepartment, function (err, department) {
    if (err) res.json(500, err);

    if (department) {
      var subject = 'Chia sẻ quản lý phòng ban';
      var body = "https://staging-dot-farmme-ggczm4ik6q-an.a.run.app/business/department?key=".concat(department.key);
      SendMail.sendMail(email, subject, body, function (err, result) {
        if (err) res.json(500, err);
        res.json('ok');
      });
    }
  });
});
router.post('/delete', function (req, res) {
  var id = req.body.id;
  Department.deleteDepartment(id, function (err, department) {
    if (err) res.json(500, err);
    res.json(department);
  });
});
router.get('/list/:id', function (req, res) {
  var id = req.params.id;
  Department.getDepartment(id, function (err, department) {
    if (err) throw err;
    res.json(department);
  });
});
router.get('/position/:id', function (req, res) {
  var id = req.params.id;
  Department.getPositionById(id, function (err, department) {
    if (err) throw err;

    if (department) {
      department.position.forEach(function (position) {
        if (position._id == id) {
          res.json(position);
        }
      });
    }
  });
});
router.get('/detail/:id', function (req, res) {
  var id = req.params.id;
  Department.getDepartmentById(id, function (err, department) {
    if (err) throw err;
    res.json(department);
  });
});
router.post('/position/new', function (req, res) {
  var department = req.body.department;
  var id = department._id;
  var position = department.position;
  position._id = undefined;
  Department.addPosition(id, position, function (err, department) {
    if (err) throw err;
    res.json(department);
  });
});
router.post('/position/edit', function (req, res) {
  var department = req.body.department;
  var position = department.position;
  var id = department.position._id;
  Department.editPosition(id, position, function (err, department) {
    if (err) throw err;
    res.json(department);
  });
});
router.post('/position/delete', function (req, res) {
  var id = req.body.position_id;
  Department.deletePosition(id, function (err, department) {
    if (err) throw err;
    res.json(department);
  });
});
router.post('/position/stop', function (req, res) {
  var id = req.body.position_id;
  Department.stopRecruiting(id, function (err, department) {
    if (err) {
      res.json(500, err);
    } else if (department) {
      res.json(department);
    } else {
      res.json(null);
    }
  });
});
router.post('/position/publish', function (req, res) {
  var id = req.body.position_id;
  Department.startRecruiting(id, function (err, department) {
    if (err) {
      res.json(500, err);
    } else if (department) {
      res.json(department);
    } else {
      res.json(null);
    }
  });
});
router.get('/findcvforposition/:position_id', function (req, res) {
  var id = req.params.position_id;
  Department.getPositionById(id, function (err, department) {
    if (err) throw err;
    department.position.forEach(function (position) {
      if (position._id == id) {
        var query = {
          "job.skill": {
            $in: position.skills
          },
          "job.status": 1,
          "job.jobtitle": position.jobtitle,
          "job.address": {
            $in: ["", position.work_location]
          }
        };

        if (position.work_environment != '') {
          query["job.work_environment"] = {
            $in: ["", position.work_environment]
          };
        }

        if (position.work_industry != '') {
          query["job.work_industry"] = {
            $in: ["", position.work_industry]
          };
        }

        if (position.name != '') {
          query["job.position"] = {
            $in: ["", position.name]
          };
        }

        Employee.getEmployeeByQuery(query, function (err, employees) {
          if (err) throw err;
          res.json(employees);
        });
      }
    });
  });
}); // router.post('/findcvforposition', function(req, res){
//     var selected = req.body.selected;
//     var result = []
//     selected.forEach(function(id) {
//         const department = new Promise((resolve) => {
//             Department.getPositionById(id, function(err, department){
//                 if (err){
//                     console.log(err)
//                 } else {
//                     resolve(department)
//                 }
//             })
//         });
//         var depart = ''
//         department.then(res => {depart = res})
//         if (depart) {
//             depart.position.forEach(async function(position){
//                 if(position._id == id){
//                     var query = { $or: [
//                         { major: {$in: position.majors}},
//                         { skill: {$in: position.skills}}
//                     ]};
//                     const cv_list = new Promise((resolve) => {
//                         User.find(query, function(err, users){
//                             if (err){
//                                 console.log(err)
//                             } else {
//                                 resolve(users)
//                             }
//                         })
//                     })
//                     var cv = '' 
//                     cv_list.then(res => {cv = res})
//                     result.push(cv)
//                 }
//             })
//         }
//     })
//     console.log(result)
// })

router.post('/position/list', function (req, res) {
  var selected = req.body.selected;
  Department.getPositionList(selected, function (err, departments) {
    if (err) throw err;
    var position_list = [];
    departments.forEach(function (department) {
      department.position.forEach(function (position) {
        if (selected.includes(position._id.toString())) {
          position.status = 0;
          position_list.push(position);
        }
      });
    });
    res.json(position_list);
  });
});
module.exports = router;