import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { deleteFile } from "./s3.service";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult | void> => {
  try {
    const { key } = event.queryStringParameters!;

    const { httpStatusCode } = await deleteFile({
      key: key as string,
    });

    if (httpStatusCode === 204) {
      return {
        body: JSON.stringify({
          data: null,
          message: "Certificate removed successfully",
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
