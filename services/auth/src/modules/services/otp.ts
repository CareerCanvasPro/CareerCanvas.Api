import {
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { v4 as uuidv4 } from "uuid";

import { config } from "../../config";

interface IAttribute {
  name: string;
  value: unknown;
}

interface PutEmailOtpParams {
  email: string;
  otp: string;
}

interface PutSmsOtpParams {
  otp: string;
  phone: string;
}

interface ScanOtpsParams {
  attribute: IAttribute;
}

export class OtpsDB {
  private readonly dynamoDBClient = new DynamoDBClient({
    region: config.aws.region,
  });

  private readonly keyName = "userID";

  private readonly tableName = "OTP";

  public putEmailOtp = async ({
    email,
    otp,
  }: PutEmailOtpParams): Promise<{ httpStatusCode: number }> => {
    const user = {
      email,
      expiresAt: Math.floor(Date.now() / 1000) + 900,
      otp,
      userID: uuidv4(),
    };

    const {
      $metadata: { httpStatusCode },
    } = await this.dynamoDBClient.send(
      new PutItemCommand({
        Item: marshall(user),
        TableName: this.tableName,
      })
    );

    return { httpStatusCode };
  };

  public putSmsOtp = async ({
    otp,
    phone,
  }: PutSmsOtpParams): Promise<{ httpStatusCode: number }> => {
    const user = {
      expiresAt: Math.floor(Date.now() / 1000) + 900,
      otp,
      phone,
      userID: uuidv4(),
    };

    const {
      $metadata: { httpStatusCode },
    } = await this.dynamoDBClient.send(
      new PutItemCommand({
        Item: marshall(user),
        TableName: this.tableName,
      })
    );

    return { httpStatusCode };
  };

  public scanOtps = async ({
    attribute,
  }: ScanOtpsParams): Promise<{
    httpStatusCode: number;
    otps: Record<string, unknown>[];
  }> => {
    const {
      $metadata: { httpStatusCode },
      Items: Otps,
    } = await this.dynamoDBClient.send(
      new ScanCommand({
        ExpressionAttributeNames: {
          "#field": attribute.name,
        },
        ExpressionAttributeValues: {
          ":value": marshall({
            value: attribute.value,
          }).value,
        },
        FilterExpression: "#field = :value",
        TableName: this.tableName,
      })
    );

    const otps = Otps.map((otp) => unmarshall(otp));

    return { httpStatusCode, otps };
  };
}
