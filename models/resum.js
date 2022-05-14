var mongoose = require("mongoose")
// User Schema
var ResumeSchema = mongoose.Schema({
	name: {
        type: String,
    },
    skills: [
        {
            name: String,
        }
    ]
});

var Resume = module.exports = mongoose.model('resume', ResumeSchema);


module.exports.createResume = function(newResume, callback){
    newResume.save(callback);
}

module.exports.getResumeByUserId = function(user_id, callback){
    var query = {user_id: user_id};
    Resume.findOne(query, callback);
}