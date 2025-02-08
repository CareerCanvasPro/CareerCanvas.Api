import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export const updateUser = async ({
  personalityTestResult,
  personalityTestStatus,
  userID,
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
}) => {
  const dynamoDBClient = new DynamoDBClient();

  const {
    $metadata: { httpStatusCode },
    Attributes,
  } = await dynamoDBClient.send(
    new UpdateItemCommand({
      ExpressionAttributeNames: {
        "#field1": "personalityTestResult",
        "#field2": "personalityTestStatus",
      },
      ExpressionAttributeValues: {
        ":value1": { S: personalityTestResult },
        ":value2": { S: personalityTestStatus },
      },
      Key: {
        userID: {
          S: userID,
        },
      },
      ReturnValues: "ALL_NEW",
      TableName: "userprofiles",
      UpdateExpression: "SET #field1 = :value1, #field2 = :value2",
    })
  );

  const updatedResult = Attributes ? unmarshall(Attributes) : null;

  return { httpStatusCode, updatedResult };
};
