var express = require('express');
var router = express.Router();
var School = require('../models/school');

router.get('/getall', function(req, res){
    School.getallSchool(function(err, schools){
        if(err) throw err;
        res.json(schools);
    });
});

module.exports = router;