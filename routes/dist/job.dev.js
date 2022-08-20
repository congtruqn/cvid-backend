"use strict";

var express = require('express');

var router = express.Router();

var Job = require('../models/job');

var Department = require('../models/department');
/* GET home page. */


router.post('/create', function (req, res, next) {
  var employee = req.body.employee;
  var position = req.body.position;
  var business = "";
  var type = req.body.type;
  Job.checkJob(employee, position, function (err, item) {
    if (err) {
      res.json(err);
    } else if (!item) {
      Department.getPositionById(position, function (err, department) {
        if (err) {
          res.json(500, err);
        } else if (department) {
          business = department.id;
          var newJob = new Job({
            employee_id: employee,
            position_id: position,
            business_id: business,
            type: type
          });
          Job.addJob(newJob, function (err, job) {
            if (err) {
              res.json(err);
            } else {
              res.json(job);
            }
          });
        } else {
          res.json(404, 'Invalid Job');
          return;
        }
      });
    } else {
      res.json(401, item);
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
router.post('/getforposition', function (req, res, next) {
  var id = req.body.id;
  Job.getCvidForPosition(id, function (err, item) {
    if (err) {
      res.json(err);
    } else {
      res.json(item);
    }
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