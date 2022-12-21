const nodemailer = require("nodemailer");
const EMAIL_ADDRESS_FROM = "hoang.nguyen@glowpacific.com";
const EMAIL_PASSWORD = "Hoang@123";

var transporter = nodemailer.createTransport({
	host: "mail.glowpacific.com", // hostname
	port: 465,
	secure: true,
	auth: {
		user: EMAIL_ADDRESS_FROM,
		pass: EMAIL_PASSWORD,
	},
	tls: {
		rejectUnauthorized: false,
	},
});

transporter.verify((error, success) => {
	if (error) {
		console.log(error);
	} else {
		console.log("Ready for message");
	}
});

module.exports.sendMail = async (email, subject, body) => {
	let mailOptions = {
		from: EMAIL_ADDRESS_FROM,
		to: email,
		subject: subject,
		html: body,
	};
	try {
		let info = await transporter.sendMail(mailOptions);
		return info;
	} catch (error) {
		console.log(error);
	}
};
