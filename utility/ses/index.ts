import {
  SESClient,
  SendEmailCommand,
  SendEmailCommandOutput,
} from "@aws-sdk/client-ses";

import { config } from "./config";

interface SendEmailParams {
  body: { html: string; text: string };
  destination: string[];
  source: string;
  subject: string;
}

export class SES {
  private readonly sesClient = new SESClient({
    region: config.aws.region,
  });

  public async sendEmail({
    body: { html, text },
    destination,
    source,
    subject,
  }: SendEmailParams): Promise<SendEmailCommandOutput> {
    return await this.sesClient.send(
      new SendEmailCommand({
        Destination: {
          ToAddresses: destination,
        },
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: html,
            },
            Text: {
              Charset: "UTF-8",
              Data: text,
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: subject,
          },
        },
        Source: source,
      })
    );
  }
  // async sendTemplatedEmail(
  //   receiver: string,
  //   template: string,
  //   templateData: object
  // ): Promise<{ status: string }> {
  //   try {
  //     const params = {
  //       Source: '"Career Canvas" <info@careercanvas.com>',
  //       Destination: {
  //         ToAddresses: [receiver],
  //       },
  //       Template: template,
  //       TemplateData: JSON.stringify(templateData),
  //     };
  //     const data = await this.sesClient.send(
  //       new SendTemplatedEmailCommand(params)
  //     );
  //     if (data.$metadata.httpStatusCode === 200) {
  //       return { status: "Order created successfully" };
  //     } else {
  //       return { status: "Failed to create order" };
  //     }
  //   } catch (error) {
  //     console.error("Error creating order:", error);
  //   }
  // }
}
