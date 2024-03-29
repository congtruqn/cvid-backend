var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var expressValidator = require("express-validator");
var flash = require("connect-flash");
var session = require("express-session");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

require("dotenv").config();
var mongoose = require("mongoose");
var cors = require("cors");

var app = express();
if (process.env.ENV === "local") {
	var port = process.env.PORT || 3000;
	app.set("port", port);
	app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}
app.use(cors({
    origin: '*'
}));
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
var index = require("./routes/index");
var users = require("./routes/users");
var register = require("./routes/register");
var province = require("./routes/province");
var school = require("./routes/school");
var authmodel = require("./models/auth");
var employee = require("./routes/employee");
var major = require("./routes/major");
var criteria = require("./routes/criteria");
var business = require("./routes/business");
var resume = require("./routes/resume");
var department = require("./routes/department");
var environment = require("./routes/environment");
var industry = require("./routes/industry");
var jobtitle = require("./routes/jobtitle");
var position = require("./routes/position");
var typebusiness = require("./routes/type_business");
var job = require("./routes/job");
var admin = require("./routes/admin");
global.__basedir = __dirname;
app.set("views", path.join(__dirname, "views"));
app.engine("handlebars", exphbs({ defaultLayout: "layout" }));
app.set("view engine", "handlebars");
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(logger("dev"));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ limit: "200mb", extended: true, parameterLimit: 1000000 }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "/public")));
// Express Session
app.use(
	session({
		secret: "secret",
		saveUninitialized: true,
		resave: true,
	}),
);
// Passport init
app.use(passport.initialize());
app.use(passport.session());
// Express Validator
app.use(
	expressValidator({
		errorFormatter: function (param, msg, value) {
			var namespace = param.split("."),
				root = namespace.shift(),
				formParam = root;

			while (namespace.length) {
				formParam += "[" + namespace.shift() + "]";
			}
			return {
				param: formParam,
				msg: msg,
				value: value,
			};
		},
	}),
);
app.use(require("request-param")({ order: ["body", "params", "query"] }));
app.use(flash());
// Global Vars
app.use(function (req, res, next) {
	res.locals.success_msg = req.flash("success_msg");
	res.locals.error_msg = req.flash("error_msg");
	res.locals.error = req.flash("error");
	res.locals.user = req.user || null;
	next();
});
app.use("/", index);
app.use("/user", users);
app.use("/employee", employee);
app.use("/business", business);
app.use("/province", province);
app.use("/school", school);
app.use("/major", major);
app.use("/criteria", criteria);
app.use("/department", department);
app.use("/job", job);
app.use("/resume", resume);
app.use("/environment", environment);
app.use("/industry", industry);
app.use("/jobtitle", jobtitle);
app.use("/typebusiness", typebusiness);
app.use("/position", position);
app.use("/admin", admin);

app.use(async function (req, res, next) {
	if (!req.headers.authorization || !req.headers.authorization.split(" ")[0] === "Basic") {
		res.status(401).json({ auth: false, message: "No token found." });
	} else {
		try {
			let decode = await checkToken(req.headers.authorization.split(" ")[1]);
			next();
		} catch (err) {
			res.status(401).json({ auth: false, message: "Failed to authenticate token." });
		}
		// if (!await authmodel.checkToken(req.headers.authorization.split(" ")[1])) {
		//   res.status(401).json({ auth: false, message: 'Failed to authenticate token.' });
		// } else {
		//   next();
		// }
	}
});
var mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
const options = {
	user: process.env.CVID_MONGO_USER,
	pass: process.env.CVID_MONGO_PASS,
	keepAlive: true,
	keepAliveInitialDelay: 300000,
	useNewUrlParser: true,
};
var db = mongoose.connect(process.env.CVID_MONGO_DSN, options);
mongoose.Promise = global.Promise;
app.use("/register", register);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error("Not Found");
	err.status = 404;
	next(err);
});
// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};
	console.log(err);
	// render the error page
	res.status(err.status || 500);
	res.render("error");
});
module.exports = app;
