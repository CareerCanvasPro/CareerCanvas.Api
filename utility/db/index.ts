import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import { config } from "./config";

interface IAttribute {
  name: string;
  value: unknown;
}

interface IKey {
  name: string;
  value: string;
}

interface GetItemParams {
  key: IKey;
  tableName: string;
}

interface PutItemParams {
  item: Record<string, unknown>;
  tableName: string;
}

interface ScanItemsParams {
  attribute: IAttribute;
  tableName: string;
}

interface UpdateItemParams {
  attribute: IAttribute;
  key: IKey;
  tableName: string;
}

export class DB {
  private readonly dynamoDBClient: DynamoDBClient;

  constructor() {
    this.dynamoDBClient = new DynamoDBClient({
      credentials: {
        accessKeyId: config.aws.accessKey,
        secretAccessKey: config.aws.secretAccessKey,
      },
      region: config.aws.region,
    });
  }

  public async getItem({ key, tableName }: GetItemParams): Promise<{
    httpStatusCode: number;
    item: Record<string, unknown>;
  }> {
    const {
      $metadata: { httpStatusCode },
      Item,
    } = await this.dynamoDBClient.send(
      new GetItemCommand({
        Key: {
          [key.name]: {
            S: key.value,
          },
        },
        TableName: tableName,
      })
    );

    const item = Item ? unmarshall(Item) : null;

    return { httpStatusCode, item };
  }

  public async putItem({ item, tableName }: PutItemParams): Promise<{
    httpStatusCode: number;
  }> {
    const {
      $metadata: { httpStatusCode },
    } = await this.dynamoDBClient.send(
      new PutItemCommand({
        Item: marshall(item),
        TableName: tableName,
      })
    );

    return {
      httpStatusCode,
    };
  }

  public async scanItems({ attribute, tableName }: ScanItemsParams): Promise<{
    httpStatusCode: number;
    items: Record<string, unknown>[];
  }> {
    const {
      $metadata: { httpStatusCode },
      Items,
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
        TableName: tableName,
      })
    );

    const items = Items.map((item) => unmarshall(item));

    return { httpStatusCode, items };
  }

  public async updateItem({
    attribute,
    key,
    tableName,
  }: UpdateItemParams): Promise<{
    httpStatusCode: number;
    updatedItem: Record<string, unknown>;
  }> {
    const {
      $metadata: { httpStatusCode },
      Attributes,
    } = await this.dynamoDBClient.send(
      new UpdateItemCommand({
        ExpressionAttributeNames: {
          "#field": attribute.name,
        },
        ExpressionAttributeValues: {
          ":value": marshall({ value: attribute.value }).value,
        },
        Key: {
          [key.name]: {
            S: key.value,
          },
        },
        ReturnValues: "ALL_NEW",
        TableName: tableName,
        UpdateExpression: "SET #field = :value",
      })
    );

    const updatedItem = Attributes ? unmarshall(Attributes) : null;

    return { httpStatusCode, updatedItem };
  }
}
