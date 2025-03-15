import nodemailer, { TransportOptions } from "nodemailer";
import { Options as SMTPTransportOptions } from "nodemailer/lib/smtp-transport";

import { config } from "../../config";

interface SendMailParams {
  html: string;
  subject: string;
  text: string;
  to: string;
}

export class Nodemailer {
  private readonly transporter = nodemailer.createTransport({
    host: config.mail.host,
    port: parseInt(config.mail.port, 10),
    secure: true,
    auth: {
      user: config.mail.username,
      pass: config.mail.password,
    },
  } as SMTPTransportOptions);

  public sendMail = async ({
    html,
    subject,
    text,
    to,
  }: SendMailParams): Promise<any> => {
    return await this.transporter.sendMail({
      from: "Career Canvas <noreply@careercanvas.pro>",
      html,
      subject,
      text,
      to,
    });
  };
}
