import jwt from 'jsonwebtoken';
import sendEmail from './sendEmail';
import MailOptions from '../types/MailOptions';
const sendConfirmationEmail = (userId: string, email: string): void => {
  const secret: any = process.env.SECRET;
  const token = jwt.sign(
    {
      userId,
    },
    secret,
    { expiresIn: '1h' },
  );
  const appEmail: any = process.env.EMAIL;
  const url = `http://localhost:3000/auth/confirmation/${token}`;
  const mailOptions: MailOptions = {
    from: appEmail,
    to: email,
    subject: 'Email confirmation.',
    html: `Confirm your email: <a href="${url}">${url}</a>`,
  };
  sendEmail(mailOptions);
};
export default sendConfirmationEmail;
