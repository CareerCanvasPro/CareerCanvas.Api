import { unmarshall } from "@aws-sdk/util-dynamodb";

import { computeMBTI, retrieveQuestions, updateUser } from "./utils";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const handler = async (event) => {
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
