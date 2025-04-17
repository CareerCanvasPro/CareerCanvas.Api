import { IntegrationStatus } from "@prisma/client";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { buildQuery, findIntegrationsByQuery } from "./integrations.db.service";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (event.multiValueQueryStringParameters) {
      const { keyword, status } = event.multiValueQueryStringParameters;

      const { query } = buildQuery({
        keyword: keyword ? keyword[0] : undefined,
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
    } else {
      const { query } = buildQuery({
        keyword: undefined,
        statuses: undefined,
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
