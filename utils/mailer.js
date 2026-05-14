const nodemailer = require("nodemailer");
require("dotenv").config();

if (!process.env.EMAIL || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL and EMAIL_PASS must be set in the .env file.");
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error("Mail transporter verification failed:", error);
    } else {
        console.log("Mail transporter is ready to send messages.");
    }
});

module.exports = transporter;