const nodemailer = require("nodemailer");
const { Resend } = require("resend");
require("dotenv").config();

const senderName = process.env.EMAIL_FROM_NAME || "StayEase";
const senderAddress =
  process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL || "noreply@stayease.app";
const replyToAddress = process.env.REPLY_TO_EMAIL || senderAddress;

let transporter = null;

if (process.env.EMAIL && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT) || 465,
    secure: process.env.EMAIL_SECURE !== "false",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
    pool: true,
    maxConnections: 3,
    requireTLS: true,
  });

  if (process.env.NODE_ENV !== "production") {
    transporter
      .verify()
      .then(() => {
        console.log("Mail transporter is ready.");
      })
      .catch((error) => {
        console.error("Mail transporter verification failed:", error);
      });
  }
}

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

async function sendVerificationEmail({ to, verifyUrl }) {
  const subject = "Verify your email for StayEase";
  const text = [
    "Welcome to StayEase!",
    "Please verify your email address to continue using your account.",
    `Verification link: ${verifyUrl}`,
  ].join("\n\n");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; color: #222;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="margin: 0; color: #ff385c; font-size: 28px;">StayEase</h2>
      </div>
      <div style="background: #ffffff; border: 1px solid #f0f0f0; border-radius: 12px; padding: 28px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
        <h3 style="margin: 0 0 12px; font-size: 22px; color: #111;">Confirm your email address</h3>
        <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #555;">
          Welcome to StayEase! Please confirm your email address to activate your account and continue exploring homes.
        </p>
        <div style="margin: 24px 0; text-align: center;">
          <a href="${verifyUrl}" style="display: inline-block; background: #ff385c; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600;">Verify Email</a>
        </div>
        <p style="margin: 0 0 8px; font-size: 13px; color: #888;">
          If the button above does not work, copy and paste this link into your browser:
        </p>
        <p style="margin: 0; font-size: 13px; color: #888; word-break: break-all;">${verifyUrl}</p>
      </div>
      <p style="margin-top: 16px; font-size: 12px; color: #999; text-align: center;">
        If you did not create this account, you can safely ignore this email.
      </p>
    </div>
  `;

  const headers = {
    "X-Mailer": "StayEase",
    "X-Priority": "3",
    "List-Unsubscribe": `<mailto:${replyToAddress}?subject=Unsubscribe>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };

  if (resend) {
    return resend.emails.send({
      from: `${senderName} <${senderAddress}>`,
      to: [to],
      subject,
      html,
      text,
      headers,
    });
  }

  if (!transporter) {
    throw new Error(
      "No email provider is configured. Set RESEND_API_KEY or EMAIL/EMAIL_PASS.",
    );
  }

  return transporter.sendMail({
    from: `${senderName} <${senderAddress}>`,
    replyTo: replyToAddress,
    to,
    subject,
    text,
    html,
    headers,
  });
}

module.exports = {
  sendVerificationEmail,
  senderAddress,
  senderName,
};
