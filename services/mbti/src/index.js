/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const {
  DynamoDBClient,
  ScanCommand,
  UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");

const retrieveQuestions = async () => {
  const dynamoDBClient = new DynamoDBClient();

  const { Items: Questions } = await dynamoDBClient.send(
    new ScanCommand({
      TableName: "PersonalityTestQuestions",
    })
  );

  const questions = Questions.map((question) => unmarshall(question));

  return { questions };
};

const computeMBTI = ({ questions, result }) => {
  const mbti = {
    EI: 0,
    JP: 0,
    SN: 0,
    TF: 0,
  };

  for (const { answer, questionID } of result) {
    for (const question of questions) {
      if (question.questionID === questionID) {
        switch (question.category) {
          case "EI":
            mbti.EI += answer * question.score;
            break;
          case "SN":
            mbti.SN += answer * question.score;
            break;
          case "TF":
            mbti.TF += answer * question.score;
            break;
          case "JP":
            mbti.JP += answer * question.score;
            break;
        }
      }
    }
  }

  const EI = mbti.EI >= 0 ? "E" : "I";
  const SN = mbti.SN >= 0 ? "S" : "N";
  const TF = mbti.TF >= 0 ? "T" : "F";
  const JP = mbti.JP >= 0 ? "J" : "P";

  const personalityTestResult = `${EI}${SN}${TF}${JP}`;

  return { personalityTestResult };
};

const updateUser = async ({
  personalityTestResult,
  personalityTestStatus,
  userID,
}) => {
  const dynamoDBClient = new DynamoDBClient();

  const { Attributes } = await dynamoDBClient.send(
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

  return { updatedResult };
};

exports.handler = async (event) => {
  try {
    if (Array.isArray(event.Records)) {
      const { questions } = await retrieveQuestions();

      for (const record of event.Records) {
        if (
          !record.dynamodb ||
          !record.dynamodb.NewImage ||
          !record.eventName
        ) {
          continue;
        } else if (
          record.eventName === "INSERT" ||
          record.eventName === "MODIFY"
        ) {
          try {
            const { result, userID } = unmarshall(record.dynamodb.NewImage);

            const { personalityTestResult } = computeMBTI({
              questions,
              result,
            });

            await updateUser({
              personalityTestResult,
              personalityTestStatus: "complete",
              userID,
            });
          } catch (error) {
            console.error(`${error.name}: ${error.message}`);
          }
        }
      }
    }
  } catch (error) {
    console.error(`${error.name}: ${error.message}`);
  }
};
