import { createHmac, randomBytes } from "crypto";

import { ApiKeyScope } from "@prisma/client";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { createApiKey } from "./integrations.db.service";
import { cleanMessage } from "./utils";
import { apiKeyPropsValidator } from "./validators";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { integrationId } = event.pathParameters!;

    const { apiKeyProps } = JSON.parse(event.body ? event.body : "");

    const { error, value: validatedApiKeyProps } =
      apiKeyPropsValidator.validate(apiKeyProps, {
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
      const { expiresInDays, scopes } = validatedApiKeyProps;

      const expiresAt = new Date();

      expiresAt.setDate(expiresAt.getDate() + expiresInDays);

      const value = randomBytes(32).toString("hex");

      const hashedValue = createHmac(
        "sha256",
        process.env.HASH_SECRET ? process.env.HASH_SECRET : ""
      )
        .update(value)
        .digest("hex");

      const apiKey = {
        expiresAt,
        hashedValue,
        scopes: scopes as ApiKeyScope[],
      };

      await createApiKey({
        apiKey,
        integrationId: integrationId!,
      });

      return {
        body: JSON.stringify({
          data: { apiKey: { expiresAt, scopes, value } },
          message: "New api key created successfully",
        }),
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 201,
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
