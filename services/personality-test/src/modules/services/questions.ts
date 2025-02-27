import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

import { client, config } from "../../config";

interface IQuestion {
  category: "EI" | "SN" | "TF" | "JP";
  question: string;
  score: 1 | -1;
}

interface PostQuestionsParams {
  questions: IQuestion[];
}

export class QuestionsDB {
  private readonly dynamoDBClient = new DynamoDBClient({
    region: config.aws.region,
  });

  private readonly table = "personality_test_questions";

  private readonly tableName = "PersonalityTestQuestions";

  public postQuestions = async ({
    questions,
  }: PostQuestionsParams): Promise<void> => {
    const query = `
      INSERT INTO ${this.table} (category, question, score)
      VALUES ($1, $2, $3);
    `;

    for (const { category, question, score } of questions) {
      await client.query(query, [category, question, score]);
    }
  };

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
