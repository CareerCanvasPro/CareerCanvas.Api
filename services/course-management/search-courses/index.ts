import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { buildQuery, findCoursesByQuery } from "./courses.db.service";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { userId } = JSON.parse(event.requestContext.authorizer?.user);

    if (event.queryStringParameters) {
      const { keyword } = event.queryStringParameters;

      const { query } = buildQuery({
        keyword,
      });

      const { courses } = await findCoursesByQuery({ query });

      courses.forEach((course) => {
        course["isSaved"] = course.id === userId;
      });

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
    } else {
      const { query } = buildQuery({
        keyword: undefined,
      });

      const { courses } = await findCoursesByQuery({ query });

      courses.forEach((course) => {
        course["isSaved"] = course.id === userId;
      });

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
