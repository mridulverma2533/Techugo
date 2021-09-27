const nodemailer = require("nodemailer");
const env=require("dotenv");

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
	host:"smtp.gmail.com",// process.env.EMAIL_SMTP_HOST,
	port: 587,//process.env.EMAIL_SMTP_PORT,
	secure: false,//process.env.EMAIL_SMTP_SECURE, // lack of ssl commented this. You can uncomment it.
	auth: {
		user: "techugodevelopment@gmail.com",//process.env.EMAIL_SMTP_USERNAME,
		pass: "Techugo@123"
	}
});
console.log(">>>>>>>>",process.env.MONGODB_URL);
exports.send = function (to, subject, html)
{
	transporter.sendMail({
		from: "techugodevelopment@gmail.com", 
		to: to, 
		subject: subject, // Subject line e.g. 'Hello ✔'
		//text: text, // plain text body e.g. Hello world?
		html: html // html body e.g. '<b>Hello world?</b>'
	}, (err, res)=>{
        console.log("err, res", err, res);
    });
};

exports.generateOTP = function(length) {
          
    // Declare a digits variable 
    // which stores all digits
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < length; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}