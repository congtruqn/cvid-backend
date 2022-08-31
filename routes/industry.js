var express = require('express');
var router = express.Router();
var Industry = require('../models/industry');

router.get('/getall', function(req, res){
    Industry.getAllIndustry(function(err, industries){
        if(err) res.json(500, err)
        res.json(industries);
    });
});

module.exports = router;