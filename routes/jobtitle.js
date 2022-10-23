var express = require('express');
var router = express.Router();
var JobTitle = require('../models/jobtitle');

router.get('/getall', function(req, res){
    JobTitle.getAllJobTitle(function(err, jobtitles){
        if(err) res.json(500, err)
        res.json(jobtitles);
    });
});

router.post('/delete', function(req, res){
    JobTitle.deleteById(req.body.id, function(err, jobtitles){
        if(err) res.json(500, err)
        res.json(jobtitles);
    });
});
module.exports = router;