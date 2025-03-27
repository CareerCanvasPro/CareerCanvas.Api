import { APIGatewayProxyResult } from "aws-lambda";

import { findQuestions } from "./questions.db.service";

export const handler = async (): Promise<APIGatewayProxyResult> => {
  try {
    const { questions } = await findQuestions();

    if (questions.length) {
      return {
        body: JSON.stringify({
          data: { questions },
          message: "Questions retrieved successfully",
        }),
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 200,
      };
    } else {
      return {
        body: JSON.stringify({ data: null, message: "No questions found" }),
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 404,
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
