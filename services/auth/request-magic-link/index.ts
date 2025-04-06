import { join } from "path";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { renderFile } from "ejs";
import { createSigner } from "fast-jwt";

import { sendMail } from "./nodemailer.service";
import { cleanMessage } from "./utils";
import { emailValidator } from "./validators";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body);

    const { error, value } = emailValidator.validate(body, {
      abortEarly: false,
    });

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
      const { email } = value;

      const sign = createSigner({
        expiresIn: "15m",
        key: async () => process.env.JWT_SECRET,
      });

      const token = await sign({
        username: email,
      });

      const magicLink = `${
        process.env.AUTH_BASE_URL
      }/auth/magic-link/verify?token=${encodeURIComponent(token)}`;

      await sendMail({
        html: await renderFile(join(__dirname, "email.ejs"), {
          magicLink,
        }),
        subject: "Magic Link to Career Canvas",
        text: `Copy and paste the link below into your browser to access your account:\n\t${magicLink}`,
        to: email,
      });

      return {
        body: JSON.stringify({
          data: null,
          message: "Magic link sent to given email successfully",
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
