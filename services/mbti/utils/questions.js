/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export const retrieveQuestions = async () => {
  const dynamoDBClient = new DynamoDBClient();

  const { Items: Questions } = await dynamoDBClient.send(
    new ScanCommand({
      TableName: "PersonalityTestQuestions",
    })
  );

  const questions = Questions.map((question) => unmarshall(question));

  return { questions };
};
