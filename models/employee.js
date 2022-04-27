var mongoose = require("mongoose")
const jwt = require('jsonwebtoken');

var employeeSchema = mongoose.Schema({

	address: {
		type: String,      
	},
    province_id: {
        type: Number,
    },
    province_name: {
        type: String,
    },
    district_id: {
        type: Number,
    },
    district_name: {
        type: String,
    },
    degree: {
        type: String,
    },
    major: {
        type: String
    },
    years_of_experience: {
        type: Number,
    }

   });
   var Employee = module.exports = mongoose.model('employee', employeeSchema);

   module.exports.getAllEmployee = function(callback){
    var query = {};
    Employee.find(query, callback);
}
module.exports.updateEmployee = function(id, newEmployee, callback){
    Employee.findByIdAndUpdate(id, newEmployee, callback);
}
