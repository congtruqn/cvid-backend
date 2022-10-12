var mongoose = require("mongoose")
// User Schema
var ProvinceSchema = mongoose.Schema({

});

var Province = module.exports = mongoose.model('provinces', ProvinceSchema);

module.exports.getallProvince = function(callback){
	Province.find(callback).sort({province: 1, district: 1, ward: 1});
}
