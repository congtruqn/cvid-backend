const nodemailer = require('nodemailer')
//require('dotenv').config();
const EMAIL_ADDRESS_FROM = 'hoang.nguyen@glowpacific.com';
const EMAIL_PASSWORD = 'Hoang@123';

var transporter = nodemailer.createTransport({
	host: 'mail.glowpacific.com',   // hostname
    port: 465, 
    secure: true,   
    auth: {
        user: EMAIL_ADDRESS_FROM,
        pass: EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

transporter.verify((error, success) => {
	if (error) {
		console.log(error)
	}
	else {
		console.log('Ready for message');
	}
})

module.exports.sendMail = function(email, subject, body, callback){
    var mailOptions = {
        from: EMAIL_ADDRESS_FROM,
        to: email,
        subject: subject,
        html: body
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
            callback(null, false)
        }
        else {
            console.log('Email sent: ' + info.response);
            callback(null, true)
        }
    })
}