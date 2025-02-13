import {
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import { config } from "../../config";

interface IAttribute {
  name: string;
  value: string | string[];
}

interface BuildFilterExpressionParams {
  attributes: IAttribute[];
}

interface PutJobParams {
  job: Record<string, unknown>;
}

interface ScanJobsParams {
  attributes: IAttribute[];
}

export class JobsDB {
  private readonly dynamoDBClient = new DynamoDBClient({
    region: config.aws.region,
  });

  private readonly tableName = "Jobs";

  private buildFilterExpression = ({
    attributes,
  }: BuildFilterExpressionParams): {
    expressionAttributeNames: Record<string, string>;
    expressionAttributeValues: Record<string, unknown>;
    filterExpression: string;
  } => {
    const expressionAttributeNames: Record<string, string> = {};

    const expressionAttributeValues: Record<string, unknown> = {};

    const filterExpressions: string[] = [];

    attributes.forEach((attribute, index) => {
      const placeholderName = `#field${index}`;

      expressionAttributeNames[placeholderName] = attribute.name;

      if (Array.isArray(attribute.value)) {
        const orExpressions: string[] = [];

        attribute.value.forEach((value, valueIndex) => {
          const placeholderValue = `:value${index}${valueIndex}`;

          expressionAttributeValues[placeholderValue] = value;

          orExpressions.push(`${placeholderName} = ${placeholderValue}`);
        });

        filterExpressions.push(`(${orExpressions.join(" OR ")})`);
      } else {
        const placeholderValue = `:value${index}`;

        expressionAttributeValues[placeholderValue] = attribute.value;

        filterExpressions.push(`${placeholderName} = ${placeholderValue}`);
      }
    });

    const filterExpression = filterExpressions.join(" AND ");

    return {
      expressionAttributeNames,
      expressionAttributeValues,
      filterExpression,
    };
  };

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

  public scanJobs = async ({
    attributes,
  }: ScanJobsParams): Promise<{
    httpStatusCode: number;
    jobs: Record<string, unknown>[];
  }> => {
    const {
      expressionAttributeNames,
      expressionAttributeValues,
      filterExpression,
    } = this.buildFilterExpression({ attributes });

    const {
      $metadata: { httpStatusCode },
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

    return { httpStatusCode, jobs };
  };
}
