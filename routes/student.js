var express = require('express');
var app = express();
var router = express.Router();
var cors = require('cors')
var Student = require('../models/student');

router.get('/getallstudent', function(req, res){
    Student.getAllStudent(function(err, students){
        if(err) throw err;
        res.json(students);
    });
});


router.get('/getstudentbyid/:id', function(req, res){
    Student.getStudentById(req.params.id, function(err, students){
        if(err) throw err;
        res.json(students);
    });
});

router.get('/getstudentbyusername/:username', function(req, res){
    Student.getStudentByUsername(req.params.username, function(err, students){
        if(err) throw err;
        res.json(students);
    });
});

router.post('/createstudent', function(req, res){
    var newStudent = new Student({
        username: req.body.username,
        fullname: req.body.fullname,
         phone: req.body.phone,
         email: req.body.email,
        address: req.body.address,
        birthday: req.body.birthday
    });
    console.log(newStudent)
    Student.createStudent(newStudent, function(err, student){
        if(err) throw err;
        res.send('Student successfully created!')
    });

});

router.post('/updatestudent', function(req, res){
    var newStudent = new Student({
        username: req.body.username,
        fullname: req.body.fullname,
         phone: req.body.phone,
         email: req.body.email,
        address: req.body.address
    });
    Student.updateStudent(req.body.id, newStudent, function(err, student){
        if(err) throw err;
        if(student){
             res.send('Student successfully updated!')
        }
        else {
            res.send('Update failed');
        }
       
    });
});
router.post('/deletestudent', function(req, res){
    var id = req.body.id;
    Student.deleteStudent(id, function(err, student){
        if(err) throw err;
        if (student) {
            res.send('Delete successful student');
        } else {
            res.send('Delete failed');
        }
     
    });    
});
module.exports = router;