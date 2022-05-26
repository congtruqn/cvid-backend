var mongoose = require("mongoose")
// User Schema
var ResumeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    detail: {
        type: String,
    }
});

var Resume = module.exports = mongoose.model('resume', ResumeSchema);


module.exports.getResumeById = function(id, callback){
    var query = {_id: id};
    Resume.findOne(query, callback);
}