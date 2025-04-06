import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent,
} from "aws-lambda";

import { generatePolicy } from "./utils";

export const handler = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  try {
    const { authorizationToken, methodArn } = event;

    if (!authorizationToken || !authorizationToken.startsWith("Bearer ")) {
      return generatePolicy({
        effect: "Deny",
        principalId: "unidentified",
        resource: methodArn,
      });
    }

    const apiKey = authorizationToken.split(" ")[1];

    if (apiKey === process.env.API_KEY) {
      return generatePolicy({
        effect: "Allow",
        principalId: "admin",
        resource: methodArn,
      });
    } else {
      return generatePolicy({
        effect: "Deny",
        principalId: "unidentified",
        resource: event.methodArn,
      });
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
