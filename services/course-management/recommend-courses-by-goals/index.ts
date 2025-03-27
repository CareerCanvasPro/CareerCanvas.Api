import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { buildQuery, findCoursesByQuery } from "./courses.db.service";
import { findUser } from "./users.db.service";
import { shuffleCourses } from "./utils";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { userId } = JSON.parse(event.requestContext.authorizer?.user);

    const { user } = await findUser({ id: userId });

    if (user) {
      const { goals, interests } = user;

      const { query } = buildQuery({
        goals: goals ? goals.map((goal) => goal.name) : null,
        interests: interests
          ? interests.map((interest) => interest.name)
          : null,
      });

      const { courses } = await findCoursesByQuery({ query });

      const { shuffledCourses } = shuffleCourses({ courses });

      if (shuffledCourses.length > 10) {
        return {
          body: JSON.stringify({
            data: { courses: shuffledCourses.slice(0, 10) },
            message:
              "Recommended courses based on goals retrieved successfully",
          }),
          headers: {
            "Content-Type": "application/json",
          },
          statusCode: 200,
        };
      } else {
        return {
          body: JSON.stringify({
            data: { courses: shuffledCourses },
            message:
              "Recommended courses based on goals retrieved successfully",
          }),
          headers: {
            "Content-Type": "application/json",
          },
          statusCode: 200,
        };
      }
    } else {
      return {
        body: JSON.stringify({ data: null, message: "Profile not found" }),
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
