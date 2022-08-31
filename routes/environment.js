
var express = require('express');
var router = express.Router();
var Environment = require('../models/environment');

router.get('/getall', function(req, res){
    Environment.getAllEnvironment(function(err, environments){
        if(err) res.json(500, err)
        res.json(environments);
    });
});

module.exports = router;