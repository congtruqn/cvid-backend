var express = require('express');
var router = express.Router();
var Resume = require('../models/resume');

/* GET home page. */
router.post('/create', function(req, res, next) {
    var newResume = new Resume({
        cvid : req.body.cvid,
        degrees : req.body.degrees,
        skills : req.body.skills,
        companies : req.body.companies,
        point : req.body.point,
        KPI : req.body.KPI,
    });

    Resume.createResume(newResume, function(err, resume) {
        if (err) {
            res.json(err);
        } else {
            res.json(resume);
        }
    });
});


module.exports = router;