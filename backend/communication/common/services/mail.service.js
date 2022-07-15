const nodemailer = require('nodemailer');
const config = require('../config/env.config');

module.exports = sendEmail;

async function sendEmail({ to, subject, html, from = config.mail_user }) {
    const transporter = nodemailer.createTransport({
        host: config.mail_host,
        port: config.mail_port,
        secure: false,
        auth: {
            user: config.mail_user,
            pass: config.mail_user_psw
        }
    });
    await transporter.sendMail({ from, to, subject, html });
}


