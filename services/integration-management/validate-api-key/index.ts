import { createHmac } from "crypto";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { findApiKey } from "./api-keys.db.service";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { headers } = event;

    if (!headers || !headers["x-api-key"]) {
      return {
        body: JSON.stringify({
          data: null,
          message: "Missing x-api-key header",
        }),
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 400,
      };
    } else {
      const hashedValue = createHmac(
        "sha256",
        process.env.HASH_SECRET ? process.env.HASH_SECRET : ""
      )
        .update(headers["x-api-key"])
        .digest("hex");

      const { apiKey } = await findApiKey({ hashedValue });

      if (
        apiKey &&
        apiKey.status === "ACTIVE" &&
        apiKey.expiresAt > new Date()
      ) {
        return {
          body: JSON.stringify({
            data: {
              integrationId: apiKey.integrationId,
              scopes: apiKey.scopes,
            },
            message: "API key is valid",
          }),
          headers: {
            "Content-Type": "application/json",
          },
          statusCode: 200,
        };
      } else {
        return {
          body: JSON.stringify({
            data: null,
            message: apiKey
              ? "API key is expired or inactive"
              : "API key is invalid",
          }),
          headers: {
            "Content-Type": "application/json",
          },
          statusCode: apiKey ? 403 : 401,
        };
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      body: JSON.stringify({
        data: null,
        message: "Internal server error",
      }),
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 500,
    };
  }
};
