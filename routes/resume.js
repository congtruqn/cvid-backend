var express = require('express');
var router = express.Router();
var resume = require('../models/resume');

/* GET home page. */
router.get('/create', function(req, res, next) {
    var data = {
        name: 'Nguyễn Văn A',
        email: '',
        phone: '',
        address: '',
        province: '',
        district: '',
        level: '',
        major: '',
        skill: '',
        experience: '',
        education: '',
        language: '',
        certificate: '',
        project: '',
        status: '',
        type: '',
        created_at: '',
        updated_at: ''
    }
    resume.createResume(data, function(err, resume) {
        if (err) {
            res.json(err);
        } else {
            res.json(resume);
        }
    });
});


module.exports = router;