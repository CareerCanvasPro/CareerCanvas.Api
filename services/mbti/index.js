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
    E: 0,
    F: 0,
    I: 0,
    J: 0,
    N: 0,
    P: 0,
    S: 0,
    T: 0,
  };

  for (const { answer, questionID } of result) {
    for (const question of questions) {
      if (question.questionID === questionID) {
        const score = answer * question.score;

        switch (question.category) {
          case "EI":
            if (score >= 0) {
              mbti.E += score;
            } else {
              mbti.I -= score;
            }

            break;
          case "SN":
            if (score >= 0) {
              mbti.S += score;
            } else {
              mbti.N -= score;
            }

            break;
          case "TF":
            if (score >= 0) {
              mbti.T += score;
            } else {
              mbti.F -= score;
            }

            break;
          case "JP":
            if (score >= 0) {
              mbti.J += score;
            } else {
              mbti.P -= score;
            }

            break;
        }
      }
    }
  }

  const personalityTestResult = {
    EI: mbti.E / (mbti.E + mbti.I),
    JP: mbti.J / (mbti.J + mbti.P),
    SN: mbti.S / (mbti.S + mbti.N),
    TF: mbti.T / (mbti.T + mbti.F),
  };

  const EI = mbti.E >= mbti.I ? "E" : "I";

  const SN = mbti.S >= mbti.N ? "S" : "N";

  const TF = mbti.T >= mbti.F ? "T" : "F";

  const JP = mbti.J >= mbti.P ? "J" : "P";

  const personalityType = `${EI}${SN}${TF}${JP}`;

  return { personalityTestResult, personalityType };
};

const updateUser = async ({
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
        ":value1": { S: personalityTestResult },
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

            const { personalityTestResult, personalityType } = computeMBTI({
              questions,
              result,
            });

            await updateUser({
              personalityTestResult,
              personalityTestStatus: "complete",
              personalityType,
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
