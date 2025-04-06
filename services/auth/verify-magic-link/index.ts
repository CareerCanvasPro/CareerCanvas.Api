import { join } from "path";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import cuid from "cuid";
import { renderFile } from "ejs";
import { TokenError, createSigner, createVerifier } from "fast-jwt";

import { findUser } from "./users.db.service";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { token } = event.queryStringParameters;

    const verify = createVerifier({
      key: async () => process.env.JWT_SECRET,
    });

    const { username } = await verify(token);

    const { user } = await findUser({ username });

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

    if (isNewUser) {
      const coins = 5;

      return {
        body: "Redirecting to Career Canvas...",
        headers: {
          "Content-Type": "text/plain",
          Location: `https://careercanvas.pro/auth/callback?token=${encodeURIComponent(
            accessToken
          )}&isNewUser=${encodeURIComponent(
            isNewUser
          )}&username=${encodeURIComponent(
            username
          )}&expiresAt=${encodeURIComponent(
            Date.now() + 604800000
          )}&coins=${encodeURIComponent(coins)}`,
        },
        statusCode: 301,
      };
    } else {
      return {
        body: "Redirecting to Career Canvas...",
        headers: {
          "Content-Type": "text/plain",
          Location: `https://careercanvas.pro/auth/callback?token=${encodeURIComponent(
            accessToken
          )}&isNewUser=${encodeURIComponent(
            isNewUser
          )}&username=${encodeURIComponent(
            username
          )}&expiresAt=${encodeURIComponent(Date.now() + 604800000)}`,
        },
        statusCode: 301,
      };
    }
  } catch (error) {
    if (error instanceof TokenError) {
      if (error.code === "FAST_JWT_EXPIRED") {
        return {
          body: await renderFile(join(__dirname, "error.ejs"), {
            message: "401 Unauthorized | Link has expired",
            title: "401 Unauthorized",
          }),
          headers: {
            "Content-Type": "text/html",
          },
          statusCode: 401,
        };
      } else {
        return {
          body: await renderFile(join(__dirname, "error.ejs"), {
            message: "401 Unauthorized | Invalid link",
            title: "401 Unauthorized",
          }),
          headers: {
            "Content-Type": "text/html",
          },
          statusCode: 401,
        };
      }
    } else {
      return {
        body: await renderFile(join(__dirname, "error.ejs"), {
          message: "500 Internal Server Error",
          title: "500 Internal Server Error",
        }),
        headers: {
          "Content-Type": "text/html",
        },
        statusCode: 500,
      };
    }
  }
};
