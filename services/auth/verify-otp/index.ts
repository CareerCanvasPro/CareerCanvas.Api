import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import cuid from "cuid";
import { createSigner } from "fast-jwt";

import { findOtp } from "./otps.db.service";
import { findUser } from "./users.db.service";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { otp, username } = event.queryStringParameters;

    const { foundOtp } = await findOtp({
      otp: otp as string,
      username: username as string,
    });

    if (foundOtp) {
      if (foundOtp.expiresAt >= new Date()) {
        const { user } = await findUser({
          username: username as string,
        });

        const isNewUser = !user;

        const userId = isNewUser ? cuid() : user.id;

        const sign = createSigner({
          expiresIn: "7d",
          key: async () => process.env.JWT_SECRET,
        });

        const accessToken = await sign({
          userId,
          username,
        });

        const coins = 5;

        return {
          body: JSON.stringify({
            data: {
              accessToken,
              ...(isNewUser && { coins }),
              expiresAt: Date.now() + 604800000,
              isNewUser,
              username,
            },
            message: "OTP verified successfully",
          }),
          headers: {
            "Content-Type": "application/json",
          },
          statusCode: 200,
        };
      } else {
        return {
          body: JSON.stringify({ data: null, message: "OTP has expired" }),
          headers: {
            "Content-Type": "application/json",
          },
          statusCode: 401,
        };
      }
    } else {
      return {
        body: JSON.stringify({ data: null, message: "Invalid OTP" }),
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 401,
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
