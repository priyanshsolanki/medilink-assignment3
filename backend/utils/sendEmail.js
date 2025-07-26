// utils/sendEmail.js
const nodemailer = require('nodemailer');

exports.sendEmail = async (to, subject, text) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
     // Force IPv4
    family: 4
  });

  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html:text });
};
