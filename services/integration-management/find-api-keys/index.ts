import { ApiKeyStatus } from "@prisma/client";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { buildQuery, findApiKeysByQuery } from "./integrations.db.service";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { integrationId } = event.pathParameters!;

    const { status } = event.multiValueQueryStringParameters!;

    const { query } = buildQuery({
      integrationId: integrationId!,
      statuses: status as ApiKeyStatus[] | undefined,
    });

    const { apiKeys } = await findApiKeysByQuery({
      query,
    });

    return {
      body: JSON.stringify({
        data: { apiKeys },
        message: "Api keys retrieved successfully",
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
