import { APIGatewayAuthorizerResult, StatementEffect } from "aws-lambda";

export const generatePolicy = ({
  decoded = null,
  effect,
  principalId,
  resource,
}: {
  decoded?: { adminId: string; email: string } | null;
  effect: StatementEffect;
  principalId: string;
  resource: string;
}): APIGatewayAuthorizerResult => {
  const policy: APIGatewayAuthorizerResult = {
    policyDocument: {
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
      Version: "2012-10-17",
    },
    principalId,
  };

  if (effect === "Allow" && decoded) {
    policy.context = {
      admin: JSON.stringify(decoded),
    };
  }

  return policy;
};
