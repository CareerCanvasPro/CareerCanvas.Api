import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { getPresignedUrl } from "./s3.service";
import { findUser } from "./users.db.service";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { userId } = JSON.parse(event.requestContext.authorizer?.user);

    const { user } = await findUser({
      id: userId,
    });

    if (user) {
      const { educations, resumes } = user;

      for (const education of educations) {
        if (education.certificate) {
          const { certificate } = education;

          const { presignedUrl } = await getPresignedUrl({
            key: certificate.key,
          });

          certificate["url"] = presignedUrl;
        }
      }

      for (const resume of resumes) {
        const { presignedUrl } = await getPresignedUrl({
          key: resume.key,
        });

        resume["url"] = presignedUrl;
      }

      return {
        body: JSON.stringify({
          data: user,
          message: "Profile retrieved successfully",
        }),
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 200,
      };
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
