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
    position: [{
        name: String,
        majors: Array,
        skills: Array,
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
module.exports.getPosition = function(condition, callback){
    var query = { $or : [
                {"position.majors": condition.major},
                {"position.skills": condition.skill},
                ],
                "position.status": 1,
                "position.amount": { $gte: 1}
            };
    Department.find(query, callback);
}

module.exports.getPositionById = function(id, callback){
    var query = {"position._id": id};
    Department.findOne(query, callback);
}
module.exports.createDepartment = function(newDepartment, callback){
    newDepartment.save(callback);
}
module.exports.addPosition = function(id, position, callback){
    Department.findOneAndUpdate({_id: id}, {$push: {position: position}}, callback);
}
module.exports.editPosition = function(id, position, callback){
    Department.findOneAndUpdate({"position._id": id}, {$set: {"position.$": position}}, callback);
}
module.exports.deletePosition = function( id, callback){
    Department.findOneAndUpdate({"position._id": id}, {$pull: {position: {_id: id}}}, callback);
}
module.exports.getDepartmentById = function(id, callback){
    Department.findById(id, callback);
}