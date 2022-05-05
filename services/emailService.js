const nodemailer = require('nodemailer');
const sendMail = async function({from, to, subject, text, html}){
    //SMTP setup
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth:{
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    let info = await transporter.sendMail({
        from : `ShareME <${from}>`,
        to,
        subject,
        text,
        html,
    });
}

module.exports = sendMail;