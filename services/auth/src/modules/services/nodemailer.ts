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
    secure: config.mail.port === '465',
    auth: {
      user: config.mail.username,
      pass: config.mail.password,
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'development' ? false : true
    },
    debug: process.env.NODE_ENV === 'development',
    logger: process.env.NODE_ENV === 'development'
  } as SMTPTransportOptions);

  public sendMail = async ({
    html,
    subject,
    text,
    to,
  }: SendMailParams): Promise<any> => {
    try {
      const result = await this.transporter.sendMail({
        from: "Career Canvas <noreply@careercanvas.pro>",
        html,
        subject,
        text,
        to,
      });
      console.log('Email sent successfully:', { to, subject, messageId: result.messageId });
      return result;
    } catch (error) {
      console.error('Failed to send email:', {
        to,
        subject,
        error: error.message,
        code: error.code,
        command: error.command
      });
      throw error;
    }
  };
}
