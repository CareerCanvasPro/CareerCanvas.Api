import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import { config } from "./config";

interface SendMailParams {
  html: string;
  subject: string;
  text: string;
  to: string;
}

export class Nodemailer {
  private readonly transporter = nodemailer.createTransport({
    auth: {
      pass: config.mail.password,
      user: config.mail.username,
    },
    host: config.mail.host,
    port: config.mail.port,
    secure: true,
  });

  public sendMail = async ({
    html,
    subject,
    text,
    to,
  }: SendMailParams): Promise<SMTPTransport.SentMessageInfo> => {
    return await this.transporter.sendMail({
      from: "Career Canvas <noreply@careercanvas.pro>",
      html,
      subject,
      text,
      to,
    });
  };
}
