import { IntegrationStatus } from "@prisma/client";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { buildQuery, findIntegrationsByQuery } from "./integrations.db.service";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { keyword } = event.queryStringParameters!;

    const { status } = event.multiValueQueryStringParameters!;

    const { query } = buildQuery({
      keyword,
      statuses: status as IntegrationStatus[] | undefined,
    });

    const { integrations } = await findIntegrationsByQuery({
      query,
    });

    return {
      body: JSON.stringify({
        data: { integrations },
        message: "Integrations retrieved successfully",
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
