import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { updateUserOccupation } from "./users.db.service";
import { cleanMessage } from "./utils";
import { occupationValidator } from "./validators";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { userId } = JSON.parse(event.requestContext.authorizer?.user);

    const { occupationId } = event.pathParameters!;

    const { occupation } = JSON.parse(event.body ? event.body : "");

    const { error, value: validatedOccupation } = occupationValidator.validate(
      occupation,
      {
        abortEarly: false,
      }
    );

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
      await updateUserOccupation({
        id: userId,
        occupation: validatedOccupation,
        occupationId: occupationId!,
      });

      return {
        body: JSON.stringify({
          data: null,
          message: "Occupation updated successfully",
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
