var mongoose = require("mongoose")
// User Schema
var ResumeSchema = mongoose.Schema({
    cvid: {
        type: String,
        required: true
    },  
    degrees: [{
        name: String,
        year: String,
        school: String,
        major: String,
        code: String,
    }],
    skills: [{
            name: String,
            school: String,
            year: String
    }],
    companies: [{
        name: String,
        position: [{
            name: String,
            year: String,
            from: String,
            to: String,
        }]
    }]
});

var Resume = module.exports = mongoose.model('resume', ResumeSchema);

module.exports.getResumeById = function(id, callback){
    var query = {_id: id};
    Resume.findOne(query, callback);
}
module.exports.getResumeByCvid = function(cvid, callback){
    var query = {cvid: cvid};
    Resume.findOne(query, callback);
}
module.exports.createResume = function(newResume, callback){
    newResume.save(callback);
}