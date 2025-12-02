import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, text, html }) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: parseInt(process.env.EMAIL_PORT) === 465, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"NepalCart" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    text,
    html,
  });
}
