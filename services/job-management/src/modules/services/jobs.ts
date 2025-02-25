import {
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import { config } from "../../config";

interface PutJobParams {
  job: Record<string, unknown>;
}

interface RetrieveRecommendedJobsParams {
  goals: string[] | undefined;
  interests: string[] | undefined;
  personalityType: string | undefined;
}

export class JobsDB {
  private readonly dynamoDBClient = new DynamoDBClient({
    region: config.aws.region,
  });

  private readonly tableName = "Jobs";

  public getAllJobs = async (): Promise<{
    httpStatusCode: number;
    jobs: Record<string, unknown>[];
  }> => {
    const {
      $metadata: { httpStatusCode },
      Items: Jobs,
    } = await this.dynamoDBClient.send(
      new ScanCommand({
        TableName: this.tableName,
      })
    );

    const jobs = Jobs.map((job) => unmarshall(job));

    return { httpStatusCode, jobs };
  };

  public putJob = async ({
    job,
  }: PutJobParams): Promise<{ httpStatusCode: number }> => {
    const {
      $metadata: { httpStatusCode },
    } = await this.dynamoDBClient.send(
      new PutItemCommand({
        Item: marshall(job),
        TableName: this.tableName,
      })
    );

    return { httpStatusCode };
  };

  public retrieveRecommendedJobs = async ({
    goals,
    interests,
    personalityType,
  }: RetrieveRecommendedJobsParams): Promise<{
    count: number;
    httpStatusCode: number;
    jobs: Record<string, unknown>[];
  }> => {
    const expressionAttributeNames: Record<string, string> = {
      "#deadline": "deadline",
    };

    const expressionAttributeValues: Record<string, number | string> = {
      ":deadline": Date.now(),
    };

    const filterExpressions: string[] = ["#deadline >= :deadline"];

    if (goals && goals.length) {
      expressionAttributeNames["#goals"] = "goals";

      goals.forEach(
        (goal, index) => (expressionAttributeValues[`:goal${index}`] = goal)
      );

      filterExpressions.push(
        `(${goals
          .map((_, index) => `contains(#goals, :goal${index})`)
          .join(" OR ")})`
      );
    }

    if (interests && interests.length) {
      expressionAttributeNames["#fields"] = "fields";

      interests.forEach(
        (interest, index) =>
          (expressionAttributeValues[`:interest${index}`] = interest)
      );

      filterExpressions.push(
        `(${interests
          .map((_, index) => `contains(#fields, :interest${index})`)
          .join(" OR ")})`
      );
    }

    if (personalityType) {
      expressionAttributeNames["#personalityTypes"] = "personalityTypes";

      expressionAttributeValues[":personalityType"] = "personalityType";

      filterExpressions.push("contains(#personalityTypes, :personalityType)");
    }

    const filterExpression = filterExpressions.join(" AND ");

    const {
      $metadata: { httpStatusCode },
      Count: count,
      Items: Jobs,
    } = await this.dynamoDBClient.send(
      new ScanCommand({
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: marshall(expressionAttributeValues),
        FilterExpression: filterExpression,
        TableName: this.tableName,
      })
    );

    const jobs = Jobs.map((job) => unmarshall(job));

    return { count, httpStatusCode, jobs };
  };
}
