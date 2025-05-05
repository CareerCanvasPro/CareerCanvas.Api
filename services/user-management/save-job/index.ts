import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { saveJob } from "./users.db.service";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult | void> => {
  try {
    const { userId } = JSON.parse(event.requestContext.authorizer?.user);

    const { jobId } = event.pathParameters!;

    await saveJob({
      id: userId,
      jobId: jobId!,
    });

    return {
      body: JSON.stringify({
        data: null,
        message: "Job saved successfully",
      }),
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 200,
    };
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
