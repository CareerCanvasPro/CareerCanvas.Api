import {
  SESClient,
  SendEmailCommand,
  SendTemplatedEmailCommand,
} from "@aws-sdk/client-ses";

import config from "./config/config";

export default class EmailSenderUtility {
  private readonly sesClient: SESClient;
  private config = {
    region: config.aws.region,
  };

  constructor() {
    this.sesClient = new SESClient(this.config);
  }
  async sendEmail(
    receiver: string,
    template: string,
    templateData: object
  ): Promise<{ status: string }> {
    try {
      const params = {
        Source: '"Career Canvas" <info@careercanvas.com>',
        Destination: {
          ToAddresses: [receiver],
        },
        Template: template,
        TemplateData: JSON.stringify(templateData),
      };
      const data = await this.sesClient.send(
        new SendTemplatedEmailCommand(params)
      );
      if (data.$metadata.httpStatusCode === 200) {
        return { status: "Order created successfully" };
      } else {
        return { status: "Failed to create order" };
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  }
}
