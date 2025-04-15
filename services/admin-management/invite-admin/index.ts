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
    const body = JSON.parse(event.body ? event.body : "");

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
        key: async () => process.env.ADMIN_JWT_SECRET,
      });

      const token = await sign({
        email,
      });

      const registrationLink = `https://careercanvas.pro/admin/register?token=${encodeURIComponent(
        token
      )}&email=${encodeURIComponent(email)}&expiresAt=${encodeURIComponent(
        Date.now() + 900000
      )}`; // DUMMY REGISTRATION LINK

      await sendMail({
        html: await renderFile(join(__dirname, "email.ejs"), {
          registrationLink,
        }),
        subject: "Registration Link to Career Canvas Admin Dashboard",
        text: `Copy and paste the link below into your browser to register as an admin user:\n\t${registrationLink}`,
        to: email,
      });

      return {
        body: JSON.stringify({
          data: null,
          message: "Registration link sent to given email successfully",
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
