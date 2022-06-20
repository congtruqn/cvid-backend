var express = require('express');
var router = express.Router();
var Department = require('../models/department');
var User = require('../models/register');


router.post('/new', function(req, res){
    var name = req.body.name;
    var id = req.body.id;
    var newDepartment = new Department({
        name: name,
        id: id,
    });
    Department.createDepartment(newDepartment, function(err, department) {
        if (err) throw err;
        res.json(department);
    });
});

router.get('/list/:id', function(req, res){
    var id = req.params.id;
    Department.getDepartment(id, function(err, department){
        if(err) throw err;
        res.json(department);
    });
});

router.post('/position/new', function(req, res){
    var department = req.body.department;
    var id = department.id;
    var position = department.position;
    majors = [];
    for (var i = 0; i < position.majors.length; i++) {
        majors.push({name: position.majors[i]});
    }
    position.majors = majors;
    Department.addPositionForDepartment(id, position, function(err, department){
        if(err) throw err;
        res.json(department);
    });
});

router.post('/position/edit', function(req, res){
    var department = req.body.department;
    const department_id = department.id;
    var position = department.position;
    const position_id = position._id;
    console.log(department_id, position_id);

    Department.editPositionForDepartment(department_id, position_id, position, function(err, department){
        if(err) throw err;
        res.json(department);
    });
});

router.post('/position/delete', function(req, res){
    var department_id = req.body.department_id;
    var position_id = req.body.position_id;
    console.log(department_id, position_id);
    Department.deletePositionForDepartment(department_id, position_id, function(err, department){
        if(err) throw err;
        res.json(department);
    });
});

router.get('/findCV/:department_id/:position_id', function(req, res){
    var department_id = req.params.department_id;
    var position_id = req.params.position_id;
    Department.getDepartmentById(department_id, function(err, department){
        if(err) throw err;
        department.position.forEach(function(position){
            if(position._id == position_id){
                var query = {
                    major: {$in: position.majors}
                };
                User.find(query, function(err, users){
                    if(err) throw err;
                    res.json(users);
                });
            }
        });
    });
});
module.exports = router;