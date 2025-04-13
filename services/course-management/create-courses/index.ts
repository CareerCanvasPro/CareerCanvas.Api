import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { createCourse } from "./courses.db.service";
import { cleanMessage } from "./utils";
import { courseArrayValidator } from "./validators";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { courses } = JSON.parse(event.body ? event.body : "");

    const { error, value: validatedCourses } = courseArrayValidator.validate(
      courses,
      {
        abortEarly: false,
      }
    );

    if (error) {
      const validationErrors = error.details.map((error) =>
        cleanMessage(error.message)
      );

      return {
        body: JSON.stringify({
          data: null,
          message: validationErrors,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 400,
      };
    } else {
      for (const course of validatedCourses) {
        const { tags } = course;

        delete course.tags;

        await createCourse({
          course,
          tags,
        });
      }

      return {
        body: JSON.stringify({
          data: null,
          message: "New courses created successfully",
        }),
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 201,
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
