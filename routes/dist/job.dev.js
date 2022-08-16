"use strict";

var express = require('express');

var router = express.Router();

var Job = require('../models/job');
/* GET home page. */


router.post('/create', function (req, res, next) {
  var employee = req.body.employee;
  var position = req.body.position;
  var business = req.body.business;
  var type = req.body.type;
  var newJob = new Job({
    employee_id: employee,
    position_id: position,
    business_id: business,
    type: type
  });
  Job.checkJob(employee, position, function (err, item) {
    if (err) {
      res.json(err);
    } else if (!item) {
      Job.addJob(newJob, function (err, job) {
        if (err) {
          res.json(err);
        } else {
          res.json(job);
        }
      });
    } else {
      res.json(item);
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