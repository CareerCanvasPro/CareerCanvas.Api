import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { unsaveCourse } from "./users.db.service";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult | void> => {
  try {
    const { userId } = JSON.parse(event.requestContext.authorizer?.user);

    const { courseId } = event.pathParameters!;

    await unsaveCourse({ courseId: courseId!, id: userId });

    return {
      body: JSON.stringify({
        data: null,
        message: "Course removed from saved courses successfully",
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
