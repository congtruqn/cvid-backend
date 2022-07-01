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
    });
    if (req.body.username && req.body.password){
        var newUser = new User({
            username: req.body.username,
            password: req.body.password,
            status: 1,
            name: newDepartment._id,
            type: 7
        });
        User.createUser(newUser, function(err, user) {
            if (err) throw err;
            
        });
    }
    res.send('ok');
});
router.get('/list/:id', function(req, res){
    var id = req.params.id;
    Department.getDepartment(id, function(err, department){
        if(err) throw err;
        res.json(department);
    });
});
router.get('/position/:id', function(req, res){
    var id = req.params.id;
    Department.getPositionById(id, function(err, department){
        if(err) throw err;
        if (department){
            department.position.forEach(function(position){
                if(position._id == id){
                    res.json(position);
                }
            });
        }
    });
});
router.get('/detail/:id', function(req, res){
    var id = req.params.id;
    Department.getDepartmentById(id, function(err, department){
        if(err) throw err;
        res.json(department);
    });
});
router.post('/position/new', function(req, res){
    var department = req.body.department;
    var id = department.id;
    var position = department.position;
    Department.addPositionForDepartment(id, position, function(err, department){
        if(err) throw err;
        res.json(department);
    });
});

router.post('/position/edit', function(req, res){
    var department = req.body.department;
    var position = department.position;
    var id = department.position._id;
    Department.editPosition(id, position, function(err, department){
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

router.get('/findCV/:position_id', function(req, res){
    var id = req.params.position_id;
    Department.getPositionById(id, function(err, department){
        if(err) throw err;
        department.position.forEach(function(position){
            if(position._id == id){
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