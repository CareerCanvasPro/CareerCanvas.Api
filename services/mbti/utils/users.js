/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

export const updateUser = async ({
  personalityTestResult,
  personalityTestStatus,
  personalityType,
  userID,
}) => {
  const dynamoDBClient = new DynamoDBClient();

  const { Attributes } = await dynamoDBClient.send(
    new UpdateItemCommand({
      ExpressionAttributeNames: {
        "#field1": "personalityTestResult",
        "#field2": "personalityTestStatus",
        "#field3": "personalityType",
      },
      ExpressionAttributeValues: {
        ":value1": marshall({ personalityTestResult }).personalityTestResult,
        ":value2": { S: personalityTestStatus },
        ":value3": { S: personalityType },
      },
      Key: {
        userID: {
          S: userID,
        },
      },
      ReturnValues: "ALL_NEW",
      TableName: "userprofiles",
      UpdateExpression:
        "SET #field1 = :value1, #field2 = :value2, #field3 = :value3",
    })
  );

  const updatedResult = Attributes ? unmarshall(Attributes) : null;

  return { updatedResult };
};
