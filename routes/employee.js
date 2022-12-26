var express = require("express");
var router = express.Router();
var cors = require("cors");
var Employee = require("../models/employee");
var Department = require("../models/department");
var authmodel = require("../models/auth");
const jwt = require("jsonwebtoken");
const accesskey = process.env.CVID_SECRET;

const { sendMail } = require("../models/send-mail");

router.post("/login", async (req, res, next)=> {
	let { username, password } = req.body;
	try {
		let foundEmployee = await Employee.getEmployeeByUsername(username);
		if (foundEmployee) {
			let isMatch = await Employee.comparePassword(password, foundEmployee.password);
			if (isMatch) {
				if (foundEmployee.confirmEmail == 0) {
					return res.status(401).json({ code: 401, massage: "Tài khoản của bạn chưa được xác thực" });
				}
				let token = jwt.sign(
					{
						id: foundEmployee._id,
					},
					accesskey,
					{ expiresIn: "1d" },
				);
				foundEmployee.password = "";
				res.status(200).json({
					token: token,
					userinfo: foundEmployee,
				});
			} else {
				return res.status(401).json({ code: 401, massage: "Sai mật khẩu" });
			}
		} else {
			return res.status(404).json({ code: 404, massage: "Tài khoản không tồn tại" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json(error.message);
	}
});

router.post("/register", async (req, res) => {
	let {
		name,
		username,
		birthdate,
		email,
		gender,
		country,
		province,
		district,
		ward,
		address,
		level,
		school,
		skill,
		startyear,
		endyear,
		professionaltitle,
		password,
	} = req.body;
	try {
		let foundEmployee = await Employee.getEmployeeByUsername(username);
		console.log(foundEmployee);
		if (foundEmployee) {
			return res.send([{ param: "username", msg: "Số điện thoại đã được sử dụng", value: username }]);
		}
		foundEmployee = await Employee.getEmployeeByEmail(email);
		if (foundEmployee) {
			return res.send([{ param: "email", msg: "Email đã được sử dụng", value: email }]);
		}

		var newEmployee = new Employee({
			name: name,
			username: username,
			birthdate: birthdate,
			email: email,
			gender: gender,
			country: country,
			province: province,
			district: district,
			ward: ward,
			address: address,
			level: level,
			school: school,
			startyear: startyear,
			endyear: endyear,
			skill: skill,
			professionaltitle: professionaltitle,
			password: password,
		});

		let createEmployee = Employee.createEmployee(newEmployee)
		if (createEmployee) {
			sendMail(
				email,
				"Xác thực tài khoản",
				`Vui lòng click vào link sau để xác thực tài khoản: ${req.headers.host}/employee/verify/${newEmployee._id}`,
			);
			return res.send("ok");
		}
	} catch (error) {
		console.log(error);
		res.status(500).json(error.message);
	}
});

router.get("/me", authmodel.checkLogin, function (req, res) {
	let id = req.user;
	console.log(id);
	Employee.getEmployeeById(id, function (err, user) {
		if (err) {
			res.status(500).json(err);
		} else if (!user) {
			res.status(404).json("No user found.");
		} else {
			res.status(200).json(user);
		}
	});
});

router.post("/createCV", function (req, res) {
	var id = req.body.id;
	var skillWorking = req.body.skillWorking;
	var skillEducation = req.body.skillEducation;
	var shortTraining = req.body.shortTraining;
	var skillEnglish = req.body.skillEnglish;
	var skillLanguage = req.body.skillLanguage;
	var skillComputer = req.body.skillComputer;
	var skillOther = req.body.skillOther;
	var assessment = req.body.assessment;
	var image = req.body.image;
	var sumAssessment = assessment.reduce(function (a, b) {
		return parseInt(a) + parseInt(b);
	}, 0);
	var point = Math.round((sumAssessment * 10) / assessment.length) / 10;

	var newCV = {
		skillWorking: skillWorking,
		skillEducation: skillEducation,
		shortTraining: shortTraining,
		skillEnglish: skillEnglish,
		skillLanguage: skillLanguage,
		skillComputer: skillComputer,
		skillOther: skillOther,
		assessment: assessment,
		image: image,
		point: point,
		approved: 0,
	};

	Employee.createCV(id, newCV, function (err, resume) {
		if (err) {
			res.json(500, err);
		} else if (resume) {
			res.json(resume);
		} else {
			res.json(404, "Error 404");
		}
	});
});

router.get("/cvid/:id", function (req, res) {
	Employee.getEmployeeById(req.params.id, function (err, cv) {
		if (err) {
			res.json(err);
		} else {
			cv.password = undefined;
			res.json(cv);
		}
	});
});

router.get("/getall", authmodel.checkAdmin, function (req, res, next) {
	Employee.getAllEmployee(function (err, employees) {
		if (err) res.json(500, err);
		else {
			res.json(200, employees);
		}
	});
});

router.post("/list/cvid", function (req, res) {
	var selected = req.body.selected;
	Employee.getEmployeeByListId(selected, function (err, list_cvid) {
		if (err) {
			res.json(err);
		} else {
			res.json(list_cvid);
		}
	});
});
router.post("/findPosition", function (req, res) {
	var condition = {
		skill: req.body.skill,
	};
	Department.getPosition(condition, function (err, position) {
		res.json(position);
	});
});

router.post("/confirm1", authmodel.checkAdmin, function (req, res) {
	let { id, confirm, note } = req.body;
	confirm.createdAt = new Date();
	confirm.createdBy = req.user.name;
	Employee.confirm1(id, confirm, note, function (err, result) {
		if (err) {
			res.status(500).json(err);
		} else {
			res.status(200).json(result);
		}
	});
});

router.post("/confirm2", authmodel.checkAdmin, function (req, res) {
	let { id, confirm } = req.body;
	confirm.createdAt = new Date();
	confirm.createdBy = req.user.name;
	Employee.confirm2(id, confirm, note, function (err, result) {
		if (err) {
			res.status(500).json(err);
		} else {
			res.status(200).json(result);
		}
	});
});

router.get("/delete/:id", authmodel.checkAdmin, function (req, res) {
	Employee.deleteEmployeeById(req.params.id, function (err, result) {
		if (err) {
			res.status(500).json(err);
		} else {
			res.status(200).json(result);
		}
	});
});

router.post("/findJob", function (req, res) {
	var id = req.body.id;
	var job = req.body.job;
	job.datetime = new Date();

	Employee.findJob(id, { job: job }, function (err, employee) {
		if (err) {
			res.json(500, err);
			return;
		} else if (!employee) {
			res.json(404, "Error 404");
			return;
		}
	});
	Department.getPosition(job, function (err, departments) {
		if (err) res.json(500, err);
		else {
			var result = [];
			departments.forEach(department => {
				department.position.forEach(item => {
					let flag = true;
					if (job.work_industry != "" && job.work_industry != item.work_industry && item.work_industry != "") {
						flag = false;
					}
					if (job.position != [] && !job.position.includes(item.name) && item.name != "") {
						flag = false;
					}
					if (
						job.work_environment != [] &&
						!job.work_environment.includes(item.work_environment) &&
						item.work_environment != ""
					) {
						flag = false;
					}
					if (job.address != "" && job.address != item.work_location) {
						flag = false;
					}
					if (item.skills.includes(job.skill) && item.status == 1 && flag == true && item.jobtitle == job.jobtitle) {
						result.push(item);
					}
				});
			});
			if (job.status == 0) {
				res.json([]);
			} else {
				res.json(result);
			}
		}
	});
});

// router.get("/verify/:id", async (req, res) => {
// 	try {
// 		let id = req.params.id;
// 		let isSuccess = await Business.verifyBusiness(id);
//         if (!isSuccess) {
//             return res.send("Xác thực thất bại");
//         }
// 		return res.send("Xác thực thành công");
// 	} catch (error) {
// 		console.log(error);
// 		return res.status(500).send(error);
// 	}
// });

module.exports = router;
