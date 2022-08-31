var mongoose = require("mongoose")
// User Schema
var EnvironmentSchema = mongoose.Schema({
    name: String,
});

var Environment = module.exports = mongoose.model('environments', EnvironmentSchema);

module.exports.getAllEnvironment = function(callback){
	Environment.find(callback);
}
