/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { unmarshall } from "@aws-sdk/util-dynamodb";

import { computeMBTI } from "./utils/mbti";
import { retrieveQuestions } from "./utils/questions";
import { updateUser } from "./utils/users";

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
            console.error(error);
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};
