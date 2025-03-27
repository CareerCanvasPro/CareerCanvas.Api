import { Level } from "@prisma/client";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { buildQuery, findCoursesByQuery } from "./courses.db.service";
import { extractDurations } from "./utils";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { keyword } = event.queryStringParameters!;

    const { duration, level } = event.multiValueQueryStringParameters!;

    const { query } = buildQuery({
      durations: duration
        ? Array.isArray(duration)
          ? extractDurations({ durations: duration as string[] })
          : extractDurations({ durations: [duration as string] })
        : null,
      keyword: keyword as string | undefined,
      levels: level
        ? Array.isArray(level)
          ? (level as Level[])
          : [level as Level]
        : null,
    });

    const { courses } = await findCoursesByQuery({ query });

    return {
      body: JSON.stringify({
        data: { courses },
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
