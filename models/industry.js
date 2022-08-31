var mongoose = require("mongoose")
// User Schema
var IndustrySchema = mongoose.Schema({
    name: String,
});

var Industry = module.exports = mongoose.model('industry', IndustrySchema);

module.exports.getAllIndustry = function(callback){
	Industry.find(callback);
}
