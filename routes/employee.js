var express = require('express');
var router = express.Router();
var Employee = require('../models/employee');

router.get('/getallemployee', function(req, res){
	    Employee.getAllEmployee(function(err, employees){
        if(err) throw err;
        res.json(employees);
    });
});
router.put('/common-infomation/:id',function (req, res){
    const newEmployee = {
        address: req.body.address,
        province_id: req.body.province_id,
        province_name:req.body.province_name,
        district_id:req.body.district_id,
        district_name:req.body.district_name,
        degree:req.body.degree,
        major:req.body.major,
        // years_of_experience:req.body.type
    };
        Employee.updateEmployee(req.params.id, newEmployee, function(err, employees){
        if(err) throw err;
        if(employees){
             res.json(employees)
        }
        else {
            res.send('Update failed');
        }
       }) 
    });
    
module.exports = router;