var express = require('express');
var router = express.Router();
var Department = require('../models/department');
var Employee = require('../models/employee');


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
    res.send('ok');
});
router.post('/delete', function(req, res){
    var id = req.body.id
    Department.deleteDepartment(id, function(err, department) {
        if (err) res.json(500, err)
        res.json(department)
    });
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
    var id = department._id;
    var position = department.position;
    position._id = undefined;
    Department.addPosition(id, position, function(err, department){
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
    var id = req.body.position_id;
    Department.deletePosition(id, function(err, department){
        if(err) throw err;
        res.json(department);
    });
});
router.post('/position/stop', function(req, res){

    var id = req.body.position_id;
    Department.stopRecruiting(id, function(err, department){
        if (err){
            res.json(500, err)
        } else if (department){
            res.json(department)
        } else {
            res.json(null)
        }
    })
});
router.get('/findcvforposition/:position_id', function(req, res){
    var id = req.params.position_id;
    Department.startRecruiting(id, function(err, department){
        if(err) throw err;
    })
    Department.getPositionById(id, function(err, department){
        if(err) throw err;
        department.position.forEach(function(position){
            if(position._id == id){
                var query = {
                    "job.skill": {$in: position.skills},
                    "job.status": 1,
                    "job.address": {$in: ["", position.work_location]},
                    $or: [
                        {"job.work_industry": ""},
                        {"job.work_industry": position.work_industry},
                    ],
                    $or: [
                        {"job.work_environment": ""},
                        {"job.work_environment": position.work_environment},
                    ],
                };
                Employee.getEmployeeByQuery(query, function(err, employees){
                    if(err) throw err;
                    res.json(employees);
                });
            }
        });
    });
});

router.post('/findcvforposition', function(req, res){
    var position = req.body.position;

    var query = {
        "job.skill": {$in: position.skills},
        "job.status": 1,
        "job.jobtitle": position.jobtitle
    };
    if (position.work_location != ""){
        query["job.address"] = {$in: ["", position.work_location]}
    }
    if (position.work_industry != ""){
        query["job.work_industry"] = {$in: ["", position.work_industry]}
    }
    if (position.work_location != ""){
        query["job.work_environment"] = {$in: ["", position.work_environment]}
    }
    if (position.name != ""){
        query["job.position"] = {$in: ["", position.name]}
    }
    if (position.levels.length != 0){
        query["level"] = {$in: position.levels}
    }
    Employee.getEmployeeByQuery(query, function(err, employees){
        if(err) throw err;
        res.json(employees);
    });
});
router.post('/position/list', function(req, res){
    var selected = req.body.selected;
    Department.getPositionList(selected, function(err, departments){
        if(err) throw err;
        var position_list = []
        departments.forEach(function(department){
            department.position.forEach(function(position){
                if (selected.includes(position._id.toString())){
                    position.status = 0
                    position_list.push(position)
                }
            });
        })
        res.json(position_list);
    });
});
module.exports = router;