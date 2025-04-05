import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import cuid from "cuid";
import { parse } from "lambda-multipart-parser";

import { putFile } from "./s3.service";
import { createUserResume } from "./users.db.service";
import { checkContentTypeValidity } from "./utils";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { userId } = JSON.parse(event.requestContext.authorizer?.user);

    const { files } = await parse(event);

    const [file] = files;

    if (!file) {
      return {
        body: JSON.stringify({ data: null, message: "No file uploaded" }),
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 400,
      };
    } else {
      const { content, contentType, filename } = file;

      const { isContentTypeValid } = checkContentTypeValidity({
        contentType,
      });

      if (!isContentTypeValid) {
        return {
          body: JSON.stringify({
            data: null,
            message: "Unsupported file format",
          }),
          headers: {
            "Content-Type": "application/json",
          },
          statusCode: 400,
        };
      } else {
        const { key } = await putFile({
          acl: "private",
          body: content,
          contentType,
          key: `${userId}-resume-${Date.now()}`,
        });

        const resume = {
          id: cuid(),
          key,
          name: filename,
          size: content.length,
          type: contentType,
        };

        await createUserResume({
          id: userId,
          resume,
        });

        return {
          body: JSON.stringify({
            data: { resume },
            message: "Resume created successfully",
          }),
          headers: {
            "Content-Type": "application/json",
          },
          statusCode: 200,
        };
      }
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
