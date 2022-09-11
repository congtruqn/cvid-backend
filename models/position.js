var mongoose = require("mongoose")
// User Schema
var PositionSchema = mongoose.Schema({
    name: String,
});

var Position = module.exports = mongoose.model('position', PositionSchema);

module.exports.getAllPosition = function(callback){
	Position.find(callback);
}
