const nodemailer = require("nodemailer");
require("dotenv").config();

if (!process.env.EMAIL || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL and EMAIL_PASS must be set in the .env file.");
}

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

if (process.env.NODE_ENV !== "production") {
    transporter.verify((error) => {
        if (error) {
            console.error("Mail transporter verification failed:", error);
        } else {
            console.log("Mail transporter is ready.");
        }
    });
}

module.exports = transporter;