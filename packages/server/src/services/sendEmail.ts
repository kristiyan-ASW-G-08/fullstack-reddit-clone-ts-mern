import nodemailer from 'nodemailer';
import MailOptions from '../types/MailOptions';
const sendEmail = (mailOptions: MailOptions): void => {
  const email: any = process.env.EMAIL;
  const emailPassword: any = process.env.EMAIL_PASSWORD;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email,
      pass: emailPassword,
    },
  });
  transporter.sendMail(
    mailOptions,
    (err: any, data: any): void => {
      if (err) {
        console.log(err);
      } else {
        console.log('Email sent');
      }
    },
  );
};
export default sendEmail;
