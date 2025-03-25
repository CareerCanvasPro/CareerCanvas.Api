import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent,
} from "aws-lambda";
import { createVerifier } from "fast-jwt";

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

    const accessToken = authorizationToken.split(" ")[1];

    const verify = createVerifier({
      key: async () => process.env.JWT_SECRET,
    });

    const decoded = await verify(accessToken);

    return generatePolicy({
      decoded,
      effect: "Allow",
      principalId: decoded.userId,
      resource: methodArn,
    });
  } catch (error) {
    console.error(error);

    return generatePolicy({
      effect: "Deny",
      principalId: "unidentified",
      resource: event.methodArn,
    });
  }
};
