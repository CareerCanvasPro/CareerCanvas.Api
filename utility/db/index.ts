import {
  DynamoDBClient,
  GetItemCommand,
  ListTablesCommand,
  QueryCommand,
  QueryCommandInput,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import { config } from "./config";

export class DB {
  private readonly config = {
    region: config.aws.region,
  };
  private readonly dynamoDBClient: DynamoDBClient;

  constructor() {
    this.dynamoDBClient = new DynamoDBClient(this.config);
  }

  public async getItem(
    key: string,
    keyValue: string,
    tableName: string
  ): Promise<{ item: Record<string, unknown> }> {
    try {
      const output = await this.dynamoDBClient.send(
        new GetItemCommand({
          Key: {
            [key]: {
              S: keyValue,
            },
          },
          TableName: tableName,
        })
      );

      const item = unmarshall(output.Item);

      return { item };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }
}
