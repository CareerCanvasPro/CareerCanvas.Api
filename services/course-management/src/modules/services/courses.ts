import {
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import { config } from "../../config";

interface PutCourseParams {
  course: Record<string, unknown>;
}

interface SearchCoursesBasedOnGoalsParams {
  goals: string[];
}

interface SearchCoursesBasedOnInterestsParams {
  interests: string[];
}

interface SearchCoursesBasedOnGoalsAndInterestsParams {
  goals: string[];
  interests: string[];
}

export class CoursesDB {
  private readonly dynamoDBClient = new DynamoDBClient({
    region: config.aws.region,
  });

  private readonly tableName = "Courses";

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

  public searchCoursesBasedOnGoals = async ({
    goals,
  }: SearchCoursesBasedOnGoalsParams): Promise<{
    count: number;
    courses: Record<string, unknown>[];
    httpStatusCode: number;
  }> => {
    const expressionAttributeNames = { "#goals": "goals" };

    const expressionAttributeValues: Record<string, string> = {};

    goals.forEach(
      (goal, index) => (expressionAttributeValues[`:goal${index}`] = goal)
    );

    const filterExpression = goals
      .map((_, index) => `contains(#goals, :goal${index})`)
      .join(" OR ");

    const {
      $metadata: { httpStatusCode },
      Count: count,
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

    return { count, courses, httpStatusCode };
  };

  public searchCoursesBasedOnInterests = async ({
    interests,
  }: SearchCoursesBasedOnInterestsParams): Promise<{
    count: number;
    courses: Record<string, unknown>[];
    httpStatusCode: number;
  }> => {
    const expressionAttributeNames = { "#topic": "topic" };

    const expressionAttributeValues: Record<string, string> = {};

    interests.forEach(
      (interest, index) =>
        (expressionAttributeValues[`:interest${index}`] = interest)
    );

    const filterExpression = interests
      .map((_, index) => `#topic = :interest${index}`)
      .join(" OR ");

    const {
      $metadata: { httpStatusCode },
      Count: count,
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

    return { count, courses, httpStatusCode };
  };

  public searchCoursesBasedOnGoalsAndInterests = async ({
    goals,
    interests,
  }: SearchCoursesBasedOnGoalsAndInterestsParams): Promise<{
    count: number;
    courses: Record<string, unknown>[];
    httpStatusCode: number;
  }> => {
    const expressionAttributeNames = { "#goals": "goals", "#topic": "topic" };

    const expressionAttributeValues: Record<string, string> = {};

    goals.forEach(
      (goal, index) => (expressionAttributeValues[`:goal${index}`] = goal)
    );

    interests.forEach(
      (interest, index) =>
        (expressionAttributeValues[`:interest${index}`] = interest)
    );

    const goalsFilterExpression = goals
      .map((_, index) => `contains(#goals, :goal${index})`)
      .join(" OR ");

    const interestsFilterExpression = interests
      .map((_, index) => `#topic = :interest${index}`)
      .join(" OR ");

    const filterExpression = `(${goalsFilterExpression}) AND (${interestsFilterExpression})`;

    const {
      $metadata: { httpStatusCode },
      Count: count,
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

    return { count, courses, httpStatusCode };
  };
}
