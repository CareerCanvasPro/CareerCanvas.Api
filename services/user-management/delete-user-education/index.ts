import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { deleteFile } from "./s3.service";
import { deleteUserEducation } from "./users.db.service";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { userId } = JSON.parse(event.requestContext.authorizer?.user);

    const { educationId } = event.pathParameters!;

    const { key } = event.queryStringParameters!;

    await deleteUserEducation({
      educationId: educationId!,
      id: userId,
    });

    if (key) {
      await deleteFile({
        key: key!,
      });
    }

    return {
      body: JSON.stringify({
        data: null,
        message: "Education deleted successfully",
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
