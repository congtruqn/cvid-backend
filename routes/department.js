var express = require("express");
var router = express.Router();
var Department = require("../models/department");
var Employee = require("../models/employee");
const { sendMail } = require("../models/send-mail");
var uuid = require("uuid");

router.post("/new", async (req, res) => {
	let { name, id, email, _id } = req.body;
	var key = uuid.v4();
	try {
		if (_id == undefined) {
			let newDepartment = new Department({
				name: name,
				id: id,
				email: email,
				key: key,
			});
			let response = await Department.createDepartment(newDepartment);
			var subject = "Chia sẻ quản lý phòng ban";
			var body = `${req.headers.host}/business/department?key=${key}`;
			await sendMail(email, subject, body);
			res.json(response);
		} else {
			let newDepartment = {
				name: name,
				email: email,
				key: key,
			};
			let response = Department.editDepartment(_id, newDepartment);
			var subject = "Chia sẻ quản lý phòng ban";
			var body = `${req.headers.origin}/business/department?key=${newDepartment.key}`;
			await sendMail(email, subject, body);
			res.status(200).json(response);
		}
	} catch (error) {
		console.log(error);
		res.status(500).json(error.message);
	}
});
router.post("/delete", function (req, res) {
	var id = req.body.id;
	Department.deleteDepartment(id, function (err, department) {
		if (err) res.json(500, err);
		res.json(department);
	});
});
router.post("/list/get-by-id", function (req, res) {
	var id = req.body.id;
	Department.getDepartment(id, function (err, department) {
		if (err) throw err;
		res.json(department);
	});
});

router.post("/position/confirm1", function (req, res) {
	let { id, confirm } = req.body;
	confirm.createdAt = new Date();
	confirm.createdBy = req.user.name;
	Department.confirm1(id, confirm, function (err, result) {
		if (err) {
			res.json(500, err);
		} else {
			res.json(result);
		}
	});
});

router.post("/position/confirm2", function (req, res) {
	let { id, confirm } = req.body;
	confirm.createdAt = new Date();
	confirm.createdBy = req.user.name;
	Department.confirm2(id, confirm, function (err, result) {
		if (err) {
			res.json(500, err);
		} else {
			res.json(result);
		}
	});
});

router.get("/position/getall", function (req, res) {
	Department.getallDepartment(function (err, departments) {
		var result = [];
		if (err) {
			res.status(500).json(err);
		} else {
			Promise.all(
				departments.map(async (department, idx1) => {
					department.position.forEach((position, idx2) => {
						position.department = department.name;
						result.push(position);
					});
				}),
			);
			res.status(200).json(result);
		}
	});
});

router.post("/list/get-by-key", function (req, res) {
	var key = req.body.key;
	Department.getDepartmentByKey(key, function (err, department) {
		if (err) throw err;
		res.json(department);
	});
});
router.get("/position/:id", function (req, res) {
	var id = req.params.id;
	Department.getPositionById(id, function (err, department) {
		if (err) throw err;
		if (department) {
			department.position.forEach(function (position) {
				if (position._id == id) {
					res.json(position);
				}
			});
		}
	});
});
router.get("/detail/:id", function (req, res) {
	var id = req.params.id;
	Department.getDepartmentById(id, function (err, department) {
		if (err) throw err;
		res.json(department);
	});
});
router.post("/position/new", function (req, res) {
	var department = req.body.department;
	var id = department._id;
	var position = department.position;
	position._id = undefined;
	Department.addPosition(id, position, function (err, department) {
		if (err) throw err;
		res.json(department);
	});
});

router.post("/position/edit", function (req, res) {
	var department = req.body.department;
	var position = department.position;
	var id = department.position._id;
	Department.editPosition(id, position, function (err, department) {
		if (err) throw err;
		res.json(department);
	});
});

router.post("/position/delete", function (req, res) {
	var id = req.body.position_id;
	Department.deletePosition(id, function (err, department) {
		if (err) throw err;
		res.json(department);
	});
});
router.post("/position/stop", function (req, res) {
	var id = req.body.position_id;
	Department.stopRecruiting(id, function (err, department) {
		if (err) {
			res.json(500, err);
		} else if (department) {
			res.json(department);
		} else {
			res.json(null);
		}
	});
});

router.post("/position/publish", function (req, res) {
	var id = req.body.position_id;
	Department.startRecruiting(id, function (err, department) {
		if (err) {
			res.json(500, err);
		} else if (department) {
			res.json(department);
		} else {
			res.json(null);
		}
	});
});

router.get("/findcvforposition/:position_id", function (req, res) {
	var id = req.params.position_id;
	Department.getPositionById(id, function (err, department) {
		if (err) throw err;
		department.position.forEach(function (position) {
			if (position._id == id) {
				var query = {
					"job.skill": { $in: position.skills },
					"job.status": 1,
					"job.jobtitle": position.jobtitle,
					"job.address": { $in: ["", position.work_location] },
				};
				if (position.work_environment != "") {
					query["job.work_environment"] = { $in: ["", position.work_environment] };
				}
				if (position.work_industry != "") {
					query["job.work_industry"] = { $in: ["", position.work_industry] };
				}
				if (position.name != "") {
					query["job.position"] = { $in: ["", position.name] };
				}
				Employee.getEmployeeByQuery(query, function (err, employees) {
					if (err) throw err;
					res.json(employees);
				});
			}
		});
	});
});

router.post("/findcvforposition", function (req, res) {
	var position = req.body.position;
	var query = {
		"job.status": 1,
		"job.jobtitle": position.jobtitle,
	};
	if (position.skills.length > 0) {
		query["job.skill"] = { $in: position.skills };
	}
	if (position.work_location != "") {
		query["job.address"] = { $in: ["", position.work_location] };
	}
	if (position.work_industry != "") {
		query["job.work_industry"] = { $in: ["", position.work_industry] };
	}
	if (position.work_environment != "") {
		query["job.work_environment"] = { $in: ["", position.work_environment] };
	}
	if (position.name != "") {
		query["job.position"] = { $in: ["", position.name] };
	}
	if (position.levels.length > 0) {
		query["level"] = { $in: position.levels };
	}
	Employee.getEmployeeByQuery(query, function (err, employees) {
		if (err) throw err;
		res.json(employees);
	});
});

router.post("/position/list", function (req, res) {
	var selected = req.body.selected;
	Department.getPositionList(selected, function (err, departments) {
		if (err) throw err;
		var position_list = [];
		departments.forEach(function (department) {
			department.position.forEach(function (position) {
				if (selected.includes(position._id.toString())) {
					position.status = 0;
					position_list.push(position);
				}
			});
		});
		res.json(position_list);
	});
});
module.exports = router;
