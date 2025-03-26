import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { updateUserGoals } from "./users.db.service";
import { cleanMessage } from "./utils";
import { stringArrayValidator } from "./validators";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { userId } = JSON.parse(event.requestContext.authorizer?.user);

    const { goals } = JSON.parse(event.body ? event.body : "");

    const { error, value: validatedGoals } = stringArrayValidator.validate(
      goals,
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
      await updateUserGoals({
        goals: validatedGoals,
        id: userId,
      });

      return {
        body: JSON.stringify({
          data: null,
          message: "Goals updated successfully",
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
