import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import {
  buildCambridgeFormatResume,
  buildEuropassFormatResume,
} from "./formats";
import { createCustomResume } from "./resumes.db.service";
import { putFile } from "./s3.service";
import { createUserResume, updateUserResume } from "./users.db.service";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { userId } = JSON.parse(event.requestContext.authorizer?.user);

    const { customResume, format, id } = JSON.parse(
      event.body ? event.body : ""
    );

    const { customResumeId } = await createCustomResume({
      customResume,
      id,
      userId,
    });

    let body: Buffer<ArrayBuffer>;

    switch (format) {
      case "cambridge":
        body = await buildCambridgeFormatResume({
          customResume,
        });
        break;
      case "europass":
        body = await buildEuropassFormatResume({
          customResume,
        });
        break;
      default:
        body = Buffer.alloc(0);
    }

    if (body.length) {
      const { key } = await putFile({
        acl: "private",
        body,
        contentType: "application/pdf",
        key: `${userId}-resume-${customResumeId}`,
      });

      const resume = {
        key,
        name: `${userId}-resume-${customResumeId}.pdf`,
        size: body.length,
        type: "application/pdf",
      };

      if (id) {
        await updateUserResume({
          id: userId,
          resume,
          resumeId: customResumeId,
        });
      } else {
        await createUserResume({
          id: userId,
          resume,
          resumeId: customResumeId,
        });
      }
    }

    return {
      body: body.toString("base64"),
      headers: {
        "Content-Disposition": 'inline; filename="resume.pdf"',
        "Content-Type": "application/pdf",
      },
      isBase64Encoded: true,
      statusCode: 200,
    };
  } catch (error) {
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
};
