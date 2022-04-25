var express = require('express');
var router = express.Router();
var Major = require('../models/major');

router.post('/new', function(req, res){
    var name = req.body.name;
    var newMajor = new Major({
        name: name
    });
    Major.createMajor(newMajor, function(err, major) {
        if (err) throw err;
        res.json(major);
    });
});
router.get('/list', function(req, res){
    Major.getallMajor(function(err, majors){
        if(err) throw err;
        res.json(majors);
    });
});
module.exports = router;