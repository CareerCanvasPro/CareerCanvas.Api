import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export const sendMail = async ({
  html,
  subject,
  text,
  to,
}: {
  html: string;
  subject: string;
  text: string;
  to: string;
}): Promise<SMTPTransport.SentMessageInfo> => {
  const transporter = nodemailer.createTransport({
    auth: {
      pass: process.env.MAIL_PASSWORD,
      user: process.env.MAIL_USERNAME,
    },
    host: process.env.MAIL_HOST,
    port: parseFloat(process.env.MAIL_PORT),
    secure: true,
  } as SMTPTransport.Options);

  return await transporter.sendMail({
    from: `Career Canvas <${process.env.MAIL_USERNAME}>`,
    html,
    subject,
    text,
    to,
  });
};
