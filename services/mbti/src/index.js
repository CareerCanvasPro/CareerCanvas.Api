import { unmarshall } from "@aws-sdk/util-dynamodb";

import { computeMBTI, retrieveQuestions, updateUser } from "./utils";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const handler = async ({ Records }) => {
  try {
    const { questions } = await retrieveQuestions();

    for (const {
      dynamodb: { NewImage },
      eventName,
    } of Records) {
      if (eventName === "INSERT" || eventName === "MODIFY") {
        const { result, userID } = unmarshall(NewImage);

        const { personalityTestResult } = computeMBTI({
          questions,
          result,
        });

        await updateUser({
          personalityTestResult,
          personalityTestStatus: "complete",
          userID,
        });
      }
    }
  } catch (error) {
    if (error.$metadata && error.$metadata.httpStatusCode) {
      return {
        body: JSON.stringify({
          data: null,
          message: `${error.name}: ${error.message}`,
        }),
        statusCode: error.$metadata.httpStatusCode,
      };
    } else {
      return {
        body: JSON.stringify({
          data: null,
          message: `${error.name}: ${error.message}`,
        }),
        statusCode: 500,
      };
    }
  }
};
