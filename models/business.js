var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const accesskey = process.env.CVID_SECRET;
// Employee Schema
var BusinessSchema = mongoose.Schema(
	{
		username: {
			type: String,
			index: true,
		},
		manager: String,
		phone: String,
		position: String,
		type_business: String,
		password: String,
		email: String,
		name: String,
		industries: Array,
		country: String,
		province: String,
		district: String,
		ward: String,
		address: String,
		majors: String,
		urlGPKD: String,
		type: {
			type: Number,
		},
		confirmPhone: {
			type: Boolean,
			default: false,
		},
		confirmEmail: {
			type: Boolean,
			default: false,
		},
		confirmNote: Array,
		confirm1: {
			status: {
				type: Number,
				default: 0,
			},
			confirmBy: String,
			confirmAt: {
				type: Date,
				default: Date.now,
			},
		},
		confirm2: {
			status: {
				type: Number,
				default: 0,
			},
			confirmBy: String,
			confirmAt: {
				type: Date,
				default: Date.now,
			},
		},
		status: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	},
);

var Business = (module.exports = mongoose.model("business", BusinessSchema));

module.exports.createBusiness = async newBusiness => {
	try {
		let salt = await bcrypt.genSalt(10);
		let hash = await bcrypt.hash(newBusiness.password, salt);
		newBusiness.password = hash;
		return await newBusiness.save();
	} catch (err) {
		console.log(err);
	}
};

module.exports.editBusiness = function (id, newBusiness, callback) {
	bcrypt.genSalt(10, function (err, salt) {
		bcrypt.hash(newBusiness.password, salt, function (err, hash) {
			newBusiness.password = hash;
			Business.findByIdAndUpdate(id, newBusiness, function (err) {
				if (err) throw err;
				console.log("Business successfully updated!");
			});
		});
	});
};

module.exports.deleteBusiness = function (id, callback) {
	Business.findByIdAndRemove(id, callback);
};

module.exports.getBusinessByUsername = async username => {
	var query = { username: username };
	return await Business.findOne(query, { password: 0 });
};

module.exports.getBusinessById = function (id, callback) {
	Business.findById(id, callback);
};
module.exports.getAllBusiness = function (callback) {
	Business.find({}, callback);
};
module.exports.comparePassword = async (candidatePassword, hash) => {
	try {
		let isMatch = await bcrypt.compare(candidatePassword, hash);
		return isMatch;
	} catch (err) {
		console.log(err);
		return false;
	}
};

module.exports.getBusinessByEmail = async (email, callback) => {
	var query = { email: email };
	return await Business.findOne(query);
};

module.exports.confirm1 = function (id, confirm, callback) {
	Business.findOneAndUpdate(id, { confirm1: confirm }, callback);
};

module.exports.confirm2 = function (id, confirm, callback) {
	Business.findByIdAndUpdate(id, { confirm2: confirm }, callback);
};

module.exports.verifyBusiness = async id => {
	try {
		let business = await Business.findById(id);
		if (business) {
			business.confirmEmail = 1;
			await business.save();
			return business;
		} else {
			return null;
		}
	} catch (err) {
		console.log(err);
	}
};
