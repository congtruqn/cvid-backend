var mongoose = require("mongoose")
// User Schema
var MajorSchema = mongoose.Schema({
	level: {
        type: String,
        required: true
    },
    majors: [
        {
            name: {
                type: String,
                required: true
            },
            code: {
                type: String,
                required: true
            },
            skills: [
                {
                    name: {
                        type: String,
                        required: true
                    },
                    code: {
                        type: String,
                        required: true
                    }
                }
            ]
        }
    ]
});

var Major = module.exports = mongoose.model('major', MajorSchema);

// module.exports.createMajor = function(newMajor, callback){
//     newMajor.save(callback);
// }

// module.exports.getMajorByName = function(name, callback){
//     var query = {name: name};
//     Major.findOne(query, callback);
// }
module.exports.getallMajor = function(callback){
    var query = {};
    Major.find(query, callback);
}
// module.exports.editMajor = function(id,newMajor, callback){
//     Major.findByIdAndUpdate(id, newMajor, callback);
// }

// module.exports.createSkillForMajor = function(major_id, skill, callback){
//     Major.findOneAndUpdate({name: major_id}, {$push: {skills: skill}}, callback);
// }