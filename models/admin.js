var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

// User Schema
var AdminSchema = mongoose.Schema(
	{
		username: {
			type: String,
			unique: true,
		},
		password: String,
		name: String,
		status: {
			type: Number,
			default: 1,
		},
		roles: Array,
		type: {
			type: Number,
			default: 1,
		},
	},
	{ timestamps: true },
);
AdminSchema.index({ username: 1 });

var Admin = (module.exports = mongoose.model("admin", AdminSchema));

module.exports.getAdminById = function (id, callback) {
	Admin.findById(id, callback);
};
module.exports.getAdminByUsername = function (username, callback) {
	Admin.findOne({ username: username }, callback);
};
module.exports.comparePassword = function (candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
		if (err) throw err;
		callback(null, isMatch);
	});
};

module.exports.createAdmin = function (admin, callback) {
	bcrypt.genSalt(10, function (err, salt) {
		bcrypt.hash(admin.password, salt, function (err, hash) {
			admin.password = hash;
			admin.save(callback);
		});
	});
};

module.exports.getAllAdmin = async () => {
	return await Admin.find({}, { password: 0 });
};

module.exports.updateAdmin = async (id, newAdmin) => {
	if (newAdmin.password) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(newAdmin.password, salt, async (err, hash) => {
				newAdmin.password = hash;
				return await Admin.findOneAndUpdate({ _id: id }, newAdmin);
			});
		});
	} else {
    delete newAdmin.password;
		return await Admin.findOneAndUpdate({ _id: id }, newAdmin);
	}
};
