var mongoose = require("mongoose")
// User Schema
var TypeBusinessSchema = mongoose.Schema({
    name: String,
});

var TypeBusiness = module.exports = mongoose.model('typebusiness', TypeBusinessSchema);

module.exports.getAllTypeBusiness = function(callback){
	TypeBusiness.find(callback).sort({ name : 1});
}
