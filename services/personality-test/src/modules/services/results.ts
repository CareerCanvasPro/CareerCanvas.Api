import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import { config } from "../../config";

interface IResult {
  answer: number;
  questionID: string;
}

interface GetResultParams {
  userID: string;
}

interface PutResultParams {
  result: IResult[];
  userID: string;
}

interface UpdateResultParams {
  result: IResult[];
  userID: string;
}

export class ResultsDB {
  private readonly dynamoDBClient = new DynamoDBClient({
    region: config.aws.region,
  });

  private readonly keyName = "userID";

  private readonly tableName = "PersonalityTestResults";

  public getResult = async ({
    userID,
  }: GetResultParams): Promise<{
    httpStatusCode: number;
    result: Record<string, IResult[]>;
  }> => {
    const {
      $metadata: { httpStatusCode },
      Item: Result,
    } = await this.dynamoDBClient.send(
      new GetItemCommand({
        Key: {
          [this.keyName]: {
            S: userID,
          },
        },
        TableName: this.tableName,
      })
    );

    const result = Result ? unmarshall(Result) : null;

    return { httpStatusCode, result };
  };

  public putResult = async ({
    result,
    userID,
  }: PutResultParams): Promise<{ httpStatusCode: number }> => {
    const {
      $metadata: { httpStatusCode },
    } = await this.dynamoDBClient.send(
      new PutItemCommand({
        Item: marshall({
          result,
          userID,
        }),
        TableName: this.tableName,
      })
    );

    return { httpStatusCode };
  };

  public updateResult = async ({
    result,
    userID,
  }: UpdateResultParams): Promise<{
    httpStatusCode: number;
    updatedResult: Record<string, IResult[]>;
  }> => {
    const {
      $metadata: { httpStatusCode },
      Attributes,
    } = await this.dynamoDBClient.send(
      new UpdateItemCommand({
        ExpressionAttributeNames: {
          "#field": "result",
        },
        ExpressionAttributeValues: {
          ":value": marshall({ result }).result,
        },
        Key: {
          [this.keyName]: {
            S: userID,
          },
        },
        ReturnValues: "ALL_NEW",
        TableName: this.tableName,
        UpdateExpression: "SET #field = :value",
      })
    );

    const updatedResult = Attributes ? unmarshall(Attributes) : null;

    return { httpStatusCode, updatedResult };
  };
}
