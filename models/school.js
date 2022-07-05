var mongoose = require("mongoose")
// User Schema
var SchoolSchema = mongoose.Schema({
	name: {
        type: String,
    }
});

var School = module.exports = mongoose.model('school', SchoolSchema);

module.exports.getallSchool = function(callback){
    School.find({}, callback);
}