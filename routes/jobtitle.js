var express = require('express');
var router = express.Router();
var JobTitle = require('../models/jobtitle');

router.get('/getall', function(req, res){
    JobTitle.getAllJobTitle(function(err, jobtitles){
        if(err) res.json(500, err)
        res.json(jobtitles);
    });
});

module.exports = router;