var mongoose = require("mongoose")
// User Schema
var DistrictSchema = mongoose.Schema({
	Id:{
		type: Number,
	},
	Name: {
		type: String,
	},
	Districts: {
		Id:Number,
        DistrictCode: String,
        DistrictName: String,
        GHNSupport: Number,
        TTCSupport: Number,
        VNPTSupport: Number,
        ViettelPostSupport: Number,
        ShipChungSupport: Number,
        GHNDistrictCode: String,
        ViettelPostDistrictCode: String,
        ShipChungDistrictCode: String
	}
});

var District = module.exports = mongoose.model('provinces', DistrictSchema);


module.exports.getallDistrict = function(callback){
	var query = {};
	District.find(query, callback);
}

