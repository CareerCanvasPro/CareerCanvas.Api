import {
  DeleteItemCommand,
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

interface DeleteOtpParams {
  keyValue: string;
}

interface PutOtpParams {
  email: string;
  otp: string;
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

  public deleteOtp = async ({
    keyValue,
  }: DeleteOtpParams): Promise<{
    deletedOtp: Record<string, unknown>;
    httpStatusCode: number;
  }> => {
    const {
      $metadata: { httpStatusCode },
      Attributes,
    } = await this.dynamoDBClient.send(
      new DeleteItemCommand({
        Key: {
          [this.keyName]: {
            S: keyValue,
          },
        },
        ReturnValues: "ALL_OLD",
        TableName: this.tableName,
      })
    );

    const deletedOtp = Attributes ? unmarshall(Attributes) : null;

    return { deletedOtp, httpStatusCode };
  };

  public putOtp = async ({
    email,
    otp,
  }: PutOtpParams): Promise<{ httpStatusCode: number }> => {
    const user = {
      email,
      expiryTime: Date.now() + 900000,
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
