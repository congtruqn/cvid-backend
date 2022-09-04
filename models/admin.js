var mongoose = require("mongoose")
var bcrypt = require('bcryptjs');
// User Schema
var AdminSchema = mongoose.Schema({
	username: String,
    password: String,
    status: Number,
});

var Admin = module.exports = mongoose.model('admin', AdminSchema);

module.exports.getAdminById = function(id, callback){
    Admin.findById(id, callback);
}
module.exports.getAdminByUsername = function(username, callback){
    Admin.findOne({username: username}, callback);
}
module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}
// module.exports.addJob = function(job, callback){
//     Admin.save(callback);
// }