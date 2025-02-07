import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

import { config } from "../../config";

export class QuestionsDB {
  private readonly dynamoDBClient = new DynamoDBClient({
    region: config.aws.region,
  });

  private readonly tableName = "PersonalityTestQuestions";

  public scanQuestions = async (): Promise<{
    count: number;
    httpStatusCode: number;
    questions: Record<string, string>[];
  }> => {
    const {
      $metadata: { httpStatusCode },
      Count: count,
      Items: Questions,
    } = await this.dynamoDBClient.send(
      new ScanCommand({
        TableName: this.tableName,
      })
    );

    const questions = Questions.map((question) => unmarshall(question));

    return { count, httpStatusCode, questions };
  };
}
