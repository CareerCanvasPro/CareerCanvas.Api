import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

import { config } from "../../config";

interface ScanUsersParams {
  username: string;
}

export class UsersDB {
  private readonly dynamoDBClient = new DynamoDBClient({
    region: config.aws.region,
  });

  private readonly tableName = "userprofiles";

  public scanUsers = async ({
    username,
  }: ScanUsersParams): Promise<{
    httpStatusCode: number;
    users: Record<string, unknown>[];
  }> => {
    const {
      $metadata: { httpStatusCode },
      Items: Users,
    } = await this.dynamoDBClient.send(
      new ScanCommand({
        ExpressionAttributeNames: {
          "#field1": "email",
          "#field2": "phone",
        },
        ExpressionAttributeValues: {
          ":value": { S: username },
        },
        FilterExpression: "#field1 = :value OR #field2 = :value",
        TableName: this.tableName,
      })
    );

    const users = Users.map((user) => unmarshall(user));

    return { httpStatusCode, users };
  };
}
