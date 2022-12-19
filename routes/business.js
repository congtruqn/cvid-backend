var express = require("express");
var router = express.Router();
var cors = require("cors");
var Business = require("../models/business");
var authmodel = require("../models/auth");
const jwt = require("jsonwebtoken");
const accesskey = process.env.CVID_SECRET;
const request = require("request");
const { sendMail } = require("../models/send-mail");

router.post("/login", async (req, res, next) => {
	let { username, password } = req.body;
	let business = await Business.getBusinessByUsername(username);

	if (!business) {
		return res.status(404).json({ code: 404, massage: "Tài khoản không tồn tại" });
	}
	let checkPassword = await Business.comparePassword(password, business.password);
	if (!checkPassword) {
		return res.status(401).json({ code: 401, massage: "Sai mật khẩu" });
	}

	if (business.confirmMail === false) {
		return res.status(401).json({ code: 401, massage: "Tài khoản của bạn chưa được xác thực" });
	}

	var token = jwt.sign(
		{
			id: business._id,
		},
		accesskey,
		{ expiresIn: "1d" },
	);
	business.password = "";
	res.status(200).json({
		token: token,
		userinfo: business,
	});
});

router.post("/register", async (req, res, next) => {
	try {
		let newBusiness = new Business({
			type: req.body.type,
			username: req.body.username,
			phone: req.body.phone,
			name: req.body.name,
			manager: req.body.manager,
			position: req.body.position,
			industries: req.body.industries,
			type_business: req.body.type_business,
			email: req.body.email,
			password: req.body.password,
			country: req.body.country,
			province: req.body.province,
			district: req.body.district,
			ward: req.body.ward,
			address: req.body.address,
			majors: req.body.majors,
			urlGPKD: req.body.image,
			status: 0,
		});
		// Validation
		req.checkBody("email", "Chưa nhập email").notEmpty();
		req.checkBody("email", "Email không hợp lệ").isEmail();
		req.checkBody("password", "Chưa nhập mật khẩu").notEmpty();
		req.checkBody("name", "Chưa nhập tên doanh nghiệp").notEmpty();
		req.checkBody("username", "Chưa nhập mã số thuế").notEmpty();
		req.checkBody("province", "Chưa chọn Tỉnh/Thành Phố").notEmpty();
		req.checkBody("district", "Chưa chọn Quận/Huyện").notEmpty();
		req.checkBody("ward", "Chưa chọn Phường/Xã").notEmpty();
		req.checkBody("industries", "Chưa chọn lĩnh vực kinh doanh").notEmpty();
		req.checkBody("address", "Chưa nhập địa chỉ").notEmpty();
		req.checkBody("type_business", "Chưa chọn loại hình doanh nghiệp").notEmpty();
		req.checkBody("manager", "Chưa nhập tên người đại diện").notEmpty();
		req.checkBody("position", "Chưa nhập chức vụ").notEmpty();
		req.checkBody("phone", "Chưa nhập số điện thoại").notEmpty();
		req.checkBody("majors", "Chưa nhập ngành nghề chính").notEmpty();
		req.checkBody("image", "Chưa nhập giấy phép kinh doanh").notEmpty();

		var errors = req.validationErrors();
		if (errors) {
			return res.send(errors);
		}
		let isEmailExist = await Business.getBusinessByEmail(newBusiness.email);
		if (isEmailExist) {
			return res.send([{ param: "email", msg: "Email đã được đăng kí", value: newBusiness.email }]);
		}
		let isUsernameExist = await Business.getBusinessByUsername(newBusiness.username);
		if (isUsernameExist) {
			return res.send([{ param: "username", msg: "Mã số thuế đã được đăng kí", value: newBusiness.username }]);
		}
		let createBusiness = await Business.createBusiness(newBusiness);
		if (createBusiness) {
			sendMail(
				newBusiness.email,
				"Xác thực tài khoản",
				`Vui lòng click vào link sau để xác thực tài khoản: ${req.headers.host}/business/verify/${createBusiness._id}`,
			);
			return res.send("ok");
		}
	} catch (error) {
		console.log(error);
		return res.status(500).send(error);
	}
});

router.post("/getinfo", function (req, res) {
	var mst = req.body.mst;
	var uri = "https://www.tratencongty.com/search/" + mst;
	request(uri, function (error, response, body) {
		if (error) {
			console.log(error);
		} else {
			res.send(body);
		}
	});
});

router.get("/getall", authmodel.checkAdmin, function (req, res, next) {
	Business.getAllBusiness(function (err, businesses) {
		if (err) res.json(500, err);
		else {
			res.json(200, businesses);
		}
	});
});

router.post("/confirm1", authmodel.checkAdmin, function (req, res) {
	let { id, confirm } = req.body;
	confirm.confirmAt = new Date();
	confirm.confirmBy = req.user.name;
	Business.confirm1(id, confirm, function (err, result) {
		if (err) {
			res.status(500).json(err);
		} else {
			res.status(200).json(result);
		}
	});
});

router.post("/confirm2", authmodel.checkAdmin, function (req, res) {
	let { id, confirm } = req.body;
	confirm.confirmAt = new Date();
	confirm.confirmBy = req.user.name;
	Business.confirm2(id, confirm, function (err, result) {
		if (err) {
			res.status(500).json(err);
		} else {
			res.status(200).json(result);
		}
	});
});

router.get("/delete/:id", authmodel.checkAdmin, function (req, res) {
	Business.deleteBusiness(req.params.id, function (err, result) {
		if (err) {
			res.status(500).json(err);
		} else {
			res.status(200).json(result);
		}
	});
});

router.get("/verify/:id", async (req, res) => {
	try {
		let id = req.params.id;
		let isSuccess = await Business.verifyBusiness(id);
        if (!isSuccess) {
            return res.send("Xác thực thất bại");
        }
		return res.send("Xác thực thành công");
	} catch (error) {
		console.log(error);
		return res.status(500).send(error);
	}
});

module.exports = router;
