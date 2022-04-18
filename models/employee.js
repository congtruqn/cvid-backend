var bcrypt = require('bcryptjs');
var mongoose = require("mongoose")
// User Schema
var employeeSchema = mongoose.Schema({
	name: {
		type: String,
	}
});
var Employee = module.exports = mongoose.model('employee', employeeSchema);

module.exports.getall = function(callback){
	var query = {};
	Employee.find(query, callback);
}
module.exports.newemployee = function(data,callback){
	data.save(callback);
}