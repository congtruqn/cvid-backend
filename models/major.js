var mongoose = require("mongoose")
// User Schema
var MajorSchema = mongoose.Schema({
	name: {
        type: String,
    }
});

var Major = module.exports = mongoose.model('major', MajorSchema);


module.exports.createMajor = function(newMajor, callback){
    newMajor.save(callback);
}

module.exports.getallMajor = function(callback){
    var query = {};
    Major.find(query, callback);
}
module.exports.editMajor = function(id,newMajor, callback){
    Major.findByIdAndUpdate(id, newMajor, callback);
}