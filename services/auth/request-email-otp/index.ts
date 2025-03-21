import { join } from "path";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { renderFile } from "ejs";
import otpGenerator from "otp-generator";

import { sendMail } from "./nodemailer.service";
import { createOtp } from "./otps.db.service";
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

      const otp = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        specialChars: false,
        upperCaseAlphabets: false,
      });

      await sendMail({
        html: await renderFile(join(__dirname, "email.ejs"), { otp }),
        subject: "OTP for Career Canvas Account Verification",
        text: `Your One-Time Password (OTP) for Career Canvas account verification is ${otp}.`,
        to: email,
      });

      await createOtp({ otp, username: email });

      return {
        body: JSON.stringify({
          data: null,
          message: "OTP sent to given email successfully",
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
