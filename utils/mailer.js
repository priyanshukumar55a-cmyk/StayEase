const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (to, verifyUrl) => {
    await resend.emails.send({
        from: process.env.EMAIL,
        to,
        subject: "Verify your email for StayEase",
        html: `
            <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff; margin-top:40px; border-radius:10px; padding:30px;"> <!-- Logo / Brand --> <tr> <td align="center" style="font-size:24px; font-weight:bold; color:#ff385c;"> StayEase </td> </tr> <!-- Heading --> <tr> <td style="padding-top:20px; font-size:20px; font-weight:bold; color:#333;"> Confirm your email address </td> </tr> <!-- Message --> <tr> <td style="padding-top:10px; color:#555; font-size:14px; line-height:1.6;"> Welcome to StayEase! 🎉 <br><br> Please confirm your email address to start exploring homes and bookings. </td> </tr> <!-- Button --> <tr> <td align="center" style="padding:30px 0;"> <a href="${verifyUrl}" style="background:#ff385c; color:white; padding:12px 24px; text-decoration:none; border-radius:6px; font-weight:bold;"> Verify Email </a> </td> </tr> <!-- Fallback --> <tr> <td style="font-size:12px; color:#888; word-break:break-all;"> If the button doesn’t work, copy and paste this link into your browser:<br> ${verifyUrl} </td> </tr> <!-- Footer --> <tr> <td style="padding-top:20px; font-size:12px; color:#aaa; text-align:center;"> If you didn’t create an account, you can safely ignore this email. </td> </tr> </table> </td> </tr>
        `
    });
};

module.exports = sendVerificationEmail;