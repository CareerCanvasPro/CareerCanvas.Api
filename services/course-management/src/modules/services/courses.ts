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

interface PutCourseParams {
  course: Record<string, unknown>;
}

interface ScanCoursesParams {
  attributes: IAttribute[];
}

export class CoursesDB {
  private readonly dynamoDBClient = new DynamoDBClient({
    region: config.aws.region,
  });

  private readonly tableName = "Courses";

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

  public getAllCourses = async (): Promise<{
    courses: Record<string, unknown>[];
    httpStatusCode: number;
  }> => {
    const {
      $metadata: { httpStatusCode },
      Items: Courses,
    } = await this.dynamoDBClient.send(
      new ScanCommand({
        TableName: this.tableName,
      })
    );

    const courses = Courses.map((course) => unmarshall(course));

    return { courses, httpStatusCode };
  };

  public putCourse = async ({
    course,
  }: PutCourseParams): Promise<{ httpStatusCode: number }> => {
    const {
      $metadata: { httpStatusCode },
    } = await this.dynamoDBClient.send(
      new PutItemCommand({
        Item: marshall(course),
        TableName: this.tableName,
      })
    );

    return { httpStatusCode };
  };

  public scanCourses = async ({
    attributes,
  }: ScanCoursesParams): Promise<{
    courses: Record<string, unknown>[];
    httpStatusCode: number;
  }> => {
    const {
      expressionAttributeNames,
      expressionAttributeValues,
      filterExpression,
    } = this.buildFilterExpression({ attributes });

    const {
      $metadata: { httpStatusCode },
      Items: Courses,
    } = await this.dynamoDBClient.send(
      new ScanCommand({
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: marshall(expressionAttributeValues),
        FilterExpression: filterExpression,
        TableName: this.tableName,
      })
    );

    const courses = Courses.map((course) => unmarshall(course));

    return { courses, httpStatusCode };
  };
}
