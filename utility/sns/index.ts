import {
  DynamoDBClient,
  PutItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import {
  CreatePlatformEndpointCommand,
  ListEndpointsByPlatformApplicationCommand,
  PublishCommand,
  SNSClient,
  SetEndpointAttributesCommand,
  SubscribeCommand,
} from "@aws-sdk/client-sns";
import { v4 as uuidv4 } from "uuid";

import { config } from "./config";

interface IMessage {
  description: string;
  image: string;
  title: string;
}

interface SendSMSParams {
  message: string;
  phoneNumber: string;
}

export class SNS {
  private readonly dynamoDBClient = new DynamoDBClient({
    region: config.aws.region,
  });

  private readonly snsClient = new SNSClient({
    region: config.aws.region,
  });

  public sendSMS = async ({
    message,
    phoneNumber,
  }: SendSMSParams): Promise<{ httpStatusCode: number }> => {
    const {
      $metadata: { httpStatusCode },
    } = await this.snsClient.send(
      new PublishCommand({
        Message: message,
        PhoneNumber: phoneNumber,
      })
    );

    return { httpStatusCode };
  };

  public async sendNotificationTopic(
    message: IMessage,
    topicArn: string
  ): Promise<{ httpStatusCode: number; messageId: string }> {
    const { description, image, title } = message;

    const {
      $metadata: { httpStatusCode },
      MessageId: messageId,
    } = await this.snsClient.send(
      new PublishCommand({
        Message: JSON.stringify(message),
        MessageAttributes: {
          description: {
            DataType: "String",
            StringValue: description,
          },
          image: {
            DataType: "String",
            StringValue: image,
          },
          title: {
            DataType: "String",
            StringValue: title,
          },
        },
        TopicArn: topicArn,
      })
    );

    return { httpStatusCode, messageId };
  }

  public async sendNotificationTarget(
    message: IMessage,
    targetArn: string
  ): Promise<{ httpStatusCode: number; messageId: string }> {
    const { description, image, title } = message;

    const {
      $metadata: { httpStatusCode },
      MessageId: messageId,
    } = await this.snsClient.send(
      new PublishCommand({
        Message: JSON.stringify(message),
        MessageAttributes: {
          description: {
            DataType: "String",
            StringValue: description,
          },
          image: {
            DataType: "String",
            StringValue: image,
          },
          title: {
            DataType: "String",
            StringValue: title,
          },
        },
        TargetArn: targetArn,
      })
    );

    return { httpStatusCode, messageId };
  }

  // async ensurePlatformEndpoint(
  //   deviceToken: string,
  //   platformApplicationArn: string,
  //   userId: string
  // ): Promise<string> {
  //   try {
  //     const existingEndpointArn = await this.findEndpointByToken(
  //       deviceToken,
  //       platformApplicationArn
  //     );

  //     if (existingEndpointArn) {
  //       await this.updatePlatformEndpoint(
  //         deviceToken,
  //         existingEndpointArn,
  //         userId
  //       );
  //       return existingEndpointArn;
  //     } else {
  //       return await this.createPlatformEndpoint(
  //         deviceToken,
  //         platformApplicationArn
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error ensuring platform endpoint:", error);
  //     throw new Error(`Failed to ensure platform endpoint: ${error.message}`);
  //   }
  // }

  public async createPlatformEndpoint(
    deviceToken: string,
    platformApplicationArn: string
  ): Promise<{ endpointArn: string; httpStatusCode: number }> {
    const {
      $metadata: { httpStatusCode },
      EndpointArn: endpointArn,
    } = await this.snsClient.send(
      new CreatePlatformEndpointCommand({
        PlatformApplicationArn: platformApplicationArn,
        Token: deviceToken,
      })
    );

    return { endpointArn, httpStatusCode };
  }

  public async updatePlatformEndpoint(
    deviceToken: string,
    endpointArn: string,
    userId: string
  ): Promise<{ httpStatusCode: number }> {
    const {
      $metadata: { httpStatusCode },
    } = await this.snsClient.send(
      new SetEndpointAttributesCommand({
        Attributes: {
          CustomUserData: userId,
          Enabled: "true",
          Token: deviceToken,
        },
        EndpointArn: endpointArn,
      })
    );

    return { httpStatusCode };
  }

  private async findEndpointByToken(
    deviceToken: string,
    platformApplicationArn: string
  ): Promise<{ endpointArn: string | null; httpStatusCode: number }> {
    const {
      $metadata: { httpStatusCode },
      Endpoints: endpoints,
    } = await this.snsClient.send(
      new ListEndpointsByPlatformApplicationCommand({
        PlatformApplicationArn: platformApplicationArn,
      })
    );

    for (const endpoint of endpoints) {
      if (endpoint.Attributes?.Token === deviceToken) {
        return { endpointArn: endpoint.EndpointArn, httpStatusCode };
      }
    }

    return { endpointArn: null, httpStatusCode };
  }

  public async subscribeEndpointToTopic(
    endpointArn: string,
    topicArn: string
  ): Promise<{ httpStatusCode: number; subscriptionArn: string }> {
    const {
      $metadata: { httpStatusCode },
      SubscriptionArn: subscriptionArn,
    } = await this.snsClient.send(
      new SubscribeCommand({
        Endpoint: endpointArn,
        Protocol: "application",
        TopicArn: topicArn,
      })
    );

    return { httpStatusCode, subscriptionArn };
  }

  async createNotification(
    userId: string,
    receiverId: string,
    notificationType: string,
    activityType: string,
    actionRoute: string,
    messageData: { title: string; description: string; image?: string }
  ): Promise<{ notificationId: string }> {
    const notificationId = uuidv4(); // Generate a unique ID for the notification

    const params = {
      Item: {
        actionRoute: {
          S: actionRoute,
        },
        activityType: {
          S: activityType,
        },
        createdAt: {
          S: new Date().toISOString(),
        },
        description: {
          S: messageData.description,
        },
        id: {
          S: notificationId,
        },
        notificationType: {
          S: notificationType,
        },
        receiverId: {
          S: receiverId,
        },
        senderId: {
          S: userId,
        },
        status: {
          S: "unread",
        },
        title: {
          S: messageData.title,
        },
        updatedAt: {
          S: new Date().toISOString(),
        },
      },
      TableName: "notifications",
    };

    try {
      await this.dynamoDBClient.send(new PutItemCommand(params));
      return { notificationId };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to store notification");
    }
  }

  async updateNotificationStatus(
    notificationId: string,
    status: string
  ): Promise<{ status: string }> {
    const params = {
      // Update both 'status' and 'updatedAt'
      ExpressionAttributeNames: {
        "#status": "status",
        // Map '#status' to the 'status' attribute
        "#updatedAt": "updatedAt", // Map '#updatedAt' to the 'updatedAt' attribute
      },
      ExpressionAttributeValues: {
        ":status": {
          S: "read",
        },
        ":updatedAt": {
          S: new Date().toISOString(),
        },
      },
      // Your DynamoDB table name
      Key: {
        id: {
          S: notificationId,
        }, // The ID of the notification to update
      },
      TableName: "notifications",
      UpdateExpression: "SET #status = :status, #updatedAt = :updatedAt",
    };

    try {
      await this.dynamoDBClient.send(new UpdateItemCommand(params));
      return { status: `Notification status updated to ${status}` };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to update notification status");
    }
  }
}
