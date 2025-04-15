import { APIGatewayAuthorizerResult, StatementEffect } from "aws-lambda";

export const generatePolicy = ({
  effect,
  principalId,
  resource,
  scopes,
}: {
  effect: StatementEffect;
  principalId: string;
  resource: string;
  scopes?: string[];
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

  if (effect === "Allow" && scopes) {
    policy.context = {
      scopes: scopes.join(","),
    };
  }

  return policy;
};
