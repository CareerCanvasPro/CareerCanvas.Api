import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { deleteApiKey } from "./api-keys.db.service";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { apiKeyId } = event.pathParameters!;

    await deleteApiKey({
      apiKeyId: apiKeyId!,
    });

    return {
      body: JSON.stringify({
        data: null,
        message: "Api key deleted successfully",
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
