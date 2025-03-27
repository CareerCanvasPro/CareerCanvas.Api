import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import {
  checkIfAnswersExist,
  createAnswers,
  updateAnswers,
} from "./answers.db.service";
import { processAnswers } from "./utils";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { userId } = JSON.parse(event.requestContext.authorizer?.user);

    const { answers } = JSON.parse(event.body ? event.body : "");

    const { answersExist } = await checkIfAnswersExist({ userId });

    if (answersExist) {
      await updateAnswers({
        answers,
        userId,
      });

      await processAnswers({ answers, id: userId });

      return {
        body: JSON.stringify({
          data: null,
          message: "Answers updated successfully",
        }),
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 200,
      };
    } else {
      await createAnswers({
        answers,
        userId,
      });

      await processAnswers({ answers, id: userId });

      return {
        body: JSON.stringify({
          data: null,
          message: "Answers created successfully",
        }),
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 200,
      };
    }
  } catch (error) {
    if (error.$metadata && error.$metadata.httpStatusCode) {
      return {
        body: JSON.stringify({
          data: null,
          message: `${error.name}: ${error.message}`,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: error.$metadata.httpStatusCode,
      };
    } else {
      return {
        body: JSON.stringify({
          data: null,
          message: `${error.name}: ${error.message}`,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 500,
      };
    }
  }
};
