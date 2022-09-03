"use strict";

var express = require('express');

var router = express.Router();

var TypeBusiness = require('../models/type_business');

router.get('/getall', function (req, res) {
  TypeBusiness.getAllTypeBusiness(function (err, result) {
    if (err) res.json(500, err);
    res.json(result);
  });
});
module.exports = router;