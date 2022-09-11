"use strict";

var express = require('express');

var router = express.Router();

var Position = require('../models/position');

router.get('/getall', function (req, res) {
  Position.getAllPosition(function (err, positions) {
    if (err) res.json(500, err);
    res.json(positions);
  });
});
module.exports = router;