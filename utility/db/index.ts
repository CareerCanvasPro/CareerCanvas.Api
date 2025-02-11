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

interface BuildUpdateExpressionParams {
  attributes: IAttribute[];
}

interface GetItemParams {
  key: IKey;
  tableName: string;
}

interface PutItemParams {
  item: Record<string, unknown>;
  tableName: string;
}

interface RemoveAttributeParams {
  attributeName: string;
  key: IKey;
  tableName: string;
}

interface ScanItemsParams {
  attribute: IAttribute;
  tableName: string;
}

interface UpdateItemParams {
  attributes: IAttribute[];
  key: IKey;
  tableName: string;
}

export class DB {
  private readonly dynamoDBClient = new DynamoDBClient({
    region: config.aws.region,
  });

  private buildUpdateExpression = ({
    attributes,
  }: BuildUpdateExpressionParams): {
    expressionAttributeNames: Record<string, string>;
    expressionAttributeValues: Record<string, unknown>;
    updateExpression: string;
  } => {
    const expressionAttributeNames: Record<string, string> = {};

    const expressionAttributeValues: Record<string, unknown> = {};

    const updateExpressions: string[] = [];

    attributes.forEach((attribute, index) => {
      const placeholderName = `#field${index}`;

      const placeholderValue = `:value${index}`;

      expressionAttributeNames[placeholderName] = attribute.name;

      expressionAttributeValues[placeholderValue] = attribute.value;

      updateExpressions.push(`${placeholderName} = ${placeholderValue}`);
    });

    const updateExpression = `SET ${updateExpressions.join(", ")}`;

    return {
      expressionAttributeNames,
      expressionAttributeValues,
      updateExpression,
    };
  };

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

  public async removeAttribute({
    attributeName,
    key,
    tableName,
  }: RemoveAttributeParams): Promise<{
    httpStatusCode: number;
    updatedItem: Record<string, unknown>;
  }> {
    const {
      $metadata: { httpStatusCode },
      Attributes,
    } = await this.dynamoDBClient.send(
      new UpdateItemCommand({
        ExpressionAttributeNames: {
          "#field": attributeName,
        },
        Key: {
          [key.name]: {
            S: key.value,
          },
        },
        ReturnValues: "ALL_NEW",
        TableName: tableName,
        UpdateExpression: "REMOVE #field",
      })
    );

    const updatedItem = Attributes ? unmarshall(Attributes) : null;

    return { httpStatusCode, updatedItem };
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

  public updateItem = async ({
    attributes,
    key,
    tableName,
  }: UpdateItemParams): Promise<{
    httpStatusCode: number;
    updatedItem: Record<string, unknown>;
  }> => {
    attributes.push({
      name: "updatedAt",
      value: Date.now(),
    });

    const {
      expressionAttributeNames,
      expressionAttributeValues,
      updateExpression,
    } = this.buildUpdateExpression({ attributes });

    const {
      $metadata: { httpStatusCode },
      Attributes,
    } = await this.dynamoDBClient.send(
      new UpdateItemCommand({
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: marshall(expressionAttributeValues),
        Key: {
          [key.name]: { S: key.value },
        },
        ReturnValues: "ALL_NEW",
        TableName: tableName,
        UpdateExpression: updateExpression,
      })
    );

    const updatedItem = Attributes ? unmarshall(Attributes) : null;

    return { httpStatusCode, updatedItem };
  };
}
