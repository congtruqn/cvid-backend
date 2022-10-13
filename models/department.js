var mongoose = require("mongoose")
// User Schema
var DepartmentSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: String,
    key: String,
    position: [{
        name: String,
        jobtitle: String,
        levels: Array,
        skills: Array,
        description: String,
        startdate: {
            type: Date,
            default: new Date()
        },
        amount: Number,
        work_location: String,
        work_industry: String,
        work_environment: String,
        min_salary: Number,
        max_salary: Number,
        experience: Number,
        requirements: String,
        criteria: Array,
        questions: Array,
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
module.exports.getDepartmentByKey = function(key, callback){
    var query = {key: key};
    Department.find(query, callback);
}
module.exports.getPosition = function(job, callback){
    var query = {"position.skills": job.skill,
                 "position.status": 1,
                 "position.jobtitle": job.jobtitle
                };
    if (job.address != '') query["position.work_location"] = job.address 
    if (job.work_industry != '') query["position.work_industry"] = job.work_industry 
    if (job.work_environment != []) query["position.work_environment"] = { $in: job.work_environment }
    if (job.type_business != '') query["type_business"] = job.type_business 
    if (job.position != []) query["position.name"] = { $in: job.position }
    Department.find(query, callback);
}

module.exports.getPositionById = function(id, callback){
    var query = {"position._id": id};
    Department.findOne(query, callback);
}
module.exports.createDepartment = function(newDepartment, callback){
    newDepartment.save(callback);
}
module.exports.editDepartment = function(id, newDepartment, callback){
    Department.findOneAndUpdate({_id: id}, newDepartment, callback);
}

module.exports.deleteDepartment = function(id, callback){
    Department.deleteOne({_id: id}, callback);
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
module.exports.startRecruiting = function( id, callback){
    Department.findOneAndUpdate({"position._id": id}, {$set: {"position.$.status": 1, "position.$.startdate": new Date}}, callback);
}
module.exports.stopRecruiting = function( id, callback){
    Department.findOneAndUpdate({"position._id": id}, {$set: {"position.$.status": 0}}, callback);
}
module.exports.getDepartmentById = function(id, callback){
    Department.findById(id, callback);
}
module.exports.getPositionList = function(selected, callback){
    var query = {"position._id": { $in: selected }};
    Department.find(query, callback);
}