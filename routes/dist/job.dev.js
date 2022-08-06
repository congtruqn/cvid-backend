"use strict";

var express = require('express');

var router = express.Router();

var Job = require('../models/job');
/* GET home page. */


router.post('/create', function (req, res, next) {
  var employee = req.body.employee;
  var position = req.body.position;
  var business = req.body.business;
  var newJob = new Job({
    employee_id: employee,
    position_id: position,
    business_id: business,
    type: req.body.type
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
    }

    res.json(item);
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
module.exports = router;