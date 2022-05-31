var express = require('express');
var router = express.Router();
var Major = require('../models/major');

// router.post('/new', function(req, res){
//     var name = req.body.name;
//     var newMajor = new Major({
//         name: name,
//         skills: []
//     });
//     Major.createMajor(newMajor, function(err, major) {
//         if (err) throw err;
//         res.json(major);
//     });
// });
router.get('/list', function(req, res){
    Major.getallMajor(function(err, majors){
        if(err) throw err;
        res.json(majors);
    });
});
router.post('/addmajor', function(req, res){
    var level = req.body.level;

    var major = {
        name: req.body.major,
    }
    Major.addMajorForLevel(level, major, function(err, major){
        if(err) throw err;
        res.json(major);
    });
});

router.post('/addskill', function(req, res){
    var level = req.body.level;
    var major = req.body.major;
    var skill = req.body.skill;
    Major.addSkillForMajor(level, major, skill, function(err, major){
        if(err) throw err;
        res.json(major);
    });
});

// router.put('/:id/edit', function(req, res){
//     var id = req.params.id;
//     var newMajor = req.body;
//     Major.editMajor(id, newMajor, function(err, major){
//         if(err) throw err;
//         res.send('success');
//     });
// });
module.exports = router;