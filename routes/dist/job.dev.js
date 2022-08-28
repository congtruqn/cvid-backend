"use strict";

var express = require('express');

var router = express.Router();

var Job = require('../models/job');

var Department = require('../models/department');

var Employee = require('../models/employee');
/* GET home page. */


router.post('/create', function (req, res, next) {
  var job = req.body.job;
  Job.checkJob(job.employee_id, job.position_id, function (err, item) {
    if (err) {
      res.json(err);
    } else {
      Department.getPositionById(job.position_id, function (err, department) {
        if (err) {
          res.json(500, err);
        } else if (department) {
          job.business_id = department.id;

          if (item) {
            var newJob = job;
            var id = item._id;
            delete newJob._id;
            console.log(newJob);
            Job.updateJob(id, newJob, function (err, job) {
              if (err) {
                res.json(err);
              } else {
                res.json(job);
              }
            });
          } else {
            var _newJob = new Job(job);

            Job.addJob(_newJob, function (err, job) {
              if (err) {
                res.json(err);
              } else {
                res.json(job);
              }
            });
          }
        } else {
          res.json(404, 'Invalid Job');
          return;
        }
      });
    }
  });
});
router.post('/getforemployee', function (req, res, next) {
  var id = req.body.id;
  Job.getJobForEmployee(id, function (err, item) {
    if (err) {
      res.json(err);
    } else {
      res.json(item);
    }
  });
});
router.post('/getforbusiness', function (req, res, next) {
  var id = req.body.id;
  Job.getCvidForBusiness(id, function (err, item) {
    if (err) {
      res.json(err);
    } else {
      res.json(item);
    }
  });
});
router.post('/getcvidforposition', function (req, res, next) {
  var id = req.body.id;
  var promise = new Promise(function (resolve, reject) {
    Job.getCvidForPosition(id, function (err, item) {
      if (err) {
        reject(err);
      } else {
        resolve(item);
      }
    });
  });
  promise.then(function (result) {
    var id_list = [];
    result.forEach(function (el) {
      id_list.push(el.employee_id);
    });
    Employee.getEmployeeByListId(id_list, function (err, cv_list) {
      res.json({
        job_list: result,
        cv_list: cv_list
      });
    });
  }, function (error) {
    res.json(500, error);
  });
});
router.post('/checkjob', function (req, res, next) {
  var employee = req.body.employee;
  var position = req.body.position;
  Job.checkJob(employee, position, function (err, item) {
    if (err) {
      res.json(500, err);
    } else if (item) {
      res.json(item);
    } else {
      res.json(null);
    }
  });
});
router.post('/delete', function (req, res, next) {
  var employee = req.body.employee;
  var position = req.body.position;
  Job.deleteJob(employee, position, function (err, item) {
    if (err) {
      res.json(500, err);
    } else if (item) {
      res.json(item);
    } else {
      res.json(null);
    }
  });
});
router.post('/pay', function (req, res, next) {
  var job_list = req.body.job_list;
  job_list.forEach(function (item) {
    Job.updatePayment(item, function (err, item) {
      if (err) {
        res.json(500, 'oh noes!');
        return;
      }
    });
    console.log(item);
  });
  res.json('ok');
});
module.exports = router;