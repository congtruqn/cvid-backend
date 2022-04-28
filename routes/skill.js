var express = require('express');
var router = express.Router();
var Major = require('../models/major');

router.post('/new', function(req, res){
    var skill = {
        name: req.body.skill_name
    }
    var major_id = req.body.major_id;

    Major.createSkillForMajor(major_id, skill, function(err, major) {
        if (err) throw err;
        res.json(major);
    });
});

module.exports = router;