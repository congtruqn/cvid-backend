var express = require('express');
var app = express();
var router = express.Router();
var cors = require('cors')
var employee = require('../models/employee');
/* GET home page. */
router.get('/', function(req, res, next) {
    employee.getall(function(err, companys){
		if(err) throw err;
		res.json(companys);
	});
});
router.post('/newemployee', function(req, res, next) {
    var newUser = new employee({
        name: "test",
    });
    employee.newemployee(newUser,function(err, companys){
		if(err) throw err;
		res.json(companys);
	});
});
module.exports = router;