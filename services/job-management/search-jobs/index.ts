import { JobLocationType, JobType } from "@prisma/client";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { buildQuery, findJobsByQuery } from "./jobs.db.service";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { keyword } = event.queryStringParameters!;

    const { locationType, type } = event.multiValueQueryStringParameters!;

    const { query } = buildQuery({
      keyword,
      locationTypes: locationType as JobLocationType[] | undefined,
      types: type as JobType[] | undefined,
    });

    const { jobs } = await findJobsByQuery({
      query,
    });

    return {
      body: JSON.stringify({
        data: { jobs },
        message: "Search results retrieved successfully",
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
