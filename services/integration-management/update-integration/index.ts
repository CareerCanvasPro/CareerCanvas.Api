import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { updateIntegration } from "./integrations.db.service";
import { cleanMessage } from "./utils";
import { integrationValidator } from "./validators";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { integrationId } = event.pathParameters!;

    const { integration } = JSON.parse(event.body ? event.body : "");

    const { error, value: validatedIntegration } =
      integrationValidator.validate(integration, {
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
      await updateIntegration({
        integration: validatedIntegration,
        integrationId: integrationId!,
      });

      return {
        body: JSON.stringify({
          data: null,
          message: "Integration updated successfully",
        }),
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 200,
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
