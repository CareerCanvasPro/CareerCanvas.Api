import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

import { config } from "../../config";

export class CareerTrendsDB {
  private readonly dynamoDBClient = new DynamoDBClient({
    region: config.aws.region,
  });

  private readonly tableName = "CareerTrends";

  public getCareerTrends = async (): Promise<{
    careers: Record<string, unknown>[];
    httpStatusCode: number;
  }> => {
    const {
      $metadata: { httpStatusCode },
      Items: Careers,
    } = await this.dynamoDBClient.send(
      new ScanCommand({
        TableName: this.tableName,
      })
    );

    const careers = Careers.map((career) => unmarshall(career));

    return { careers, httpStatusCode };
  };
}
