var express = require("express");
var router = express.Router();
var criteria = require("../models/criteria");

router.get("/getall", function (req, res, next) {
	criteria.getallCriteria(function (err, criteria) {
		if (err) {
			res.json(err);
		} else {
			res.json(criteria);
		}
	});
});
module.exports = router;
