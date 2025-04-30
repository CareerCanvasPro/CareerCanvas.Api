import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { deleteFile } from "./s3.service";
import { deleteUserResume } from "./users.db.service";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult | void> => {
  try {
    const { userId } = JSON.parse(event.requestContext.authorizer?.user);

    const { resumeId } = event.pathParameters!;

    await deleteUserResume({
      id: userId,
      resumeId: resumeId!,
    });

    const { httpStatusCode } = await deleteFile({
      key: `${userId}-resume-${resumeId}`,
    });

    if (httpStatusCode === 204) {
      return {
        body: JSON.stringify({
          data: null,
          message: "Resume removed successfully",
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
