import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const retrieveQuestions = async () => {
  const dynamoDBClient = new DynamoDBClient();
  const {
    $metadata: { httpStatusCode },
    Items: Questions,
  } = await dynamoDBClient.send(
    new ScanCommand({
      TableName: "PersonalityTestQuestions",
    })
  );

  const questions = Questions.map((question) => unmarshall(question));

  return { httpStatusCode, questions };
};
