import { createHmac } from "crypto";

import {
  APIGatewayAuthorizerResult,
  APIGatewayRequestAuthorizerEvent,
} from "aws-lambda";

import { findApiKey } from "./api-keys.db.service";
import { generatePolicy } from "./utils";

export const handler = async (
  event: APIGatewayRequestAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  try {
    const { headers, methodArn } = event;

    if (!headers || !headers["x-api-key"]) {
      return generatePolicy({
        effect: "Deny",
        principalId: "unidentified",
        resource: methodArn,
      });
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
        return generatePolicy({
          effect: "Allow",
          principalId: apiKey.integrationId,
          resource: methodArn,
          scopes: apiKey.scopes,
        });
      } else {
        return generatePolicy({
          effect: "Deny",
          principalId: "unidentified",
          resource: methodArn,
        });
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return generatePolicy({
      effect: "Deny",
      principalId: "unidentified",
      resource: event.methodArn,
    });
  }
};
