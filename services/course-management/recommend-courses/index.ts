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
      const { educations, interests, occupations, skills } = user;

      const { query } = buildQuery({
        educations,
        interests: interests.map((interest) => interest.name),
        occupations,
        skills: skills.map((skill) => skill.name),
      });

      const { courses } = await findCoursesByQuery({ query });

      const { shuffledCourses } = shuffleCourses({ courses });

      if (shuffledCourses.length > 10) {
        const courses = shuffledCourses.slice(0, 10);

        courses.forEach((course) => {
          course["isSaved"] = course.id === userId;
        });

        return {
          body: JSON.stringify({
            data: { courses },
            message: "Recommended courses retrieved successfully",
          }),
          headers: {
            "Content-Type": "application/json",
          },
          statusCode: 200,
        };
      } else {
        shuffledCourses.forEach((course) => {
          course["isSaved"] = course.id === userId;
        });

        return {
          body: JSON.stringify({
            data: { courses: shuffledCourses },
            message: "Recommended courses retrieved successfully",
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
