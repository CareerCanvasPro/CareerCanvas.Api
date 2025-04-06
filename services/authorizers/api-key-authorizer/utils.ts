import { APIGatewayAuthorizerResult, StatementEffect } from "aws-lambda";

export const generatePolicy = ({
  effect,
  principalId,
  resource,
}: {
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

  return policy;
};
