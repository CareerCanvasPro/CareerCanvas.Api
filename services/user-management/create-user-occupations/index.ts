import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { createUserOccupations } from "./users.db.service";
import { cleanMessage } from "./utils";
import { occupationArrayValidator } from "./validators";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { userId } = JSON.parse(event.requestContext.authorizer?.user);

    const { occupations } = JSON.parse(event.body ? event.body : "");

    const { error, value: validatedOccupations } =
      occupationArrayValidator.validate(occupations, {
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
      const { coins } = await createUserOccupations({
        id: userId,
        occupations: validatedOccupations,
      });

      return {
        body: JSON.stringify({
          data: { coins },
          message: "Occupations created successfully",
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
