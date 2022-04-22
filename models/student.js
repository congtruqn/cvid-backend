var mongoose = require("mongoose")
const jwt = require('jsonwebtoken');
// Student Schema
var studentSchema = mongoose.Schema({

	username: {
        type: String,
        required: true
    },
    fullname: {
        type: String
    },
    phone: {
        type: String
    },
    email : {
        type: String
    },
    address: {   
        type: Date
    },
    birthday: {
        type: String
    }
});

var Student = module.exports = mongoose.model('student', studentSchema);

module.exports.createStudent = function(newStudent, callback){
    newStudent.save(callback);
}
module.exports.getstudentById = function(id, callback){
    Student.findById(id, callback);
}
module.exports.getstudentByUsername = function(username, callback){
    var query = {username: username};
    Student.findOne(query, callback);
}
module.exports.getAllStudent = function(callback){
    var query = {};
    Student.find(query, callback);
}
module.exports.updateStudent = function(id, newStudent, callback){
    Student.findByIdAndUpdate(id, newStudent, callback);
}
module.exports.deleteStudent = function(id, callback){
    Student.findByIdAndRemove(id, callback);
}