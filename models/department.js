var mongoose = require("mongoose")
// User Schema
var DepartmentSchema = mongoose.Schema({
    id: {
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
    },
    password: {
        type: String
    },
    position: [{
        name: String,
        majors: Array,
        amount: Number,
        description: String,
        enddate: Date,
        startdate: Date,
        work_location: String,
        min_salary: Number,
        max_salary: Number,
        requirements: String,
        contact: String,
        phone: String,
        email: String,
        address: String,
        note: String,
        status: String,
    }],

});

var Department = module.exports = mongoose.model('department', DepartmentSchema);

module.exports.getallDepartment = function(callback){
    var query = {};
    Department.find(query, callback);
}
module.exports.getDepartment = function(id, callback){
    var query = {id: id};
    Department.find(query, callback);
}
module.exports.createDepartment = function(newDepartment, callback){
    newDepartment.save(callback);
}
module.exports.addPositionForDepartment = function(id, position, callback){
    Department.findOneAndUpdate({_id: id}, {$push: {position: position}}, callback);
}
module.exports.editPositionForDepartment = function(department_id, position_id, position, callback){
    Department.findOneAndUpdate({_id: department_id, "position._id": position_id}, {$set: {"position.$": position}}, callback);
}