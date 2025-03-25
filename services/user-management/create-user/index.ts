import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { createUser } from "./users.db.service";
import { cleanMessage } from "./utils";
import { userValidator } from "./validators";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { userId, username } = JSON.parse(
      event.requestContext.authorizer?.user
    );

    let body = JSON.parse(event.body ? event.body : "");

    body = { ...body, userId, username };

    delete body.exp;

    delete body.iat;

    const { error, value } = userValidator.validate(body, {
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
      const { address, email, name, phone, profilePicture, userId, username } =
        value;

      const coins = 10;

      await createUser({
        user: {
          address,
          coins,
          email,
          id: userId,
          name,
          phone,
          profilePicture,
          username,
        },
      });

      return {
        body: JSON.stringify({
          data: { coins },
          message: "New profile created successfully",
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
