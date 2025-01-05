import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });;

export const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS,
    },
  });

  // Define email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // Send email
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return response.status(500).json({ message: error.message });
    }
    });
};

