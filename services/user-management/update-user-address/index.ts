import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { updateUserAddress } from "./users.db.service";
import { cleanMessage } from "./utils";
import { stringValidator } from "./validators";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { userId } = JSON.parse(event.requestContext.authorizer?.user);

    const { address } = JSON.parse(event.body ? event.body : "");

    const { error, value: validatedAddress } = stringValidator.validate(
      address,
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
      await updateUserAddress({
        address: validatedAddress,
        id: userId,
      });

      return {
        body: JSON.stringify({
          data: null,
          message: "Address updated successfully",
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
