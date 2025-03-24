import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { TokenError, createVerifier } from "fast-jwt";

import { createUser } from "./users.db.service";
import { cleanMessage } from "./utils";
import { userValidator } from "./validators";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { Authorization } = event.headers;

    if (!Authorization || !Authorization.startsWith("Bearer ")) {
      return {
        body: JSON.stringify({
          data: null,
          message: "Access token is missing",
        }),
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 401,
      };
    } else {
      const accessToken = Authorization.split(" ")[1];

      const verify = createVerifier({
        key: async () => process.env.JWT_SECRET,
      });

      const decoded = await verify(accessToken);

      let body = JSON.parse(event.body);

      body = { ...body, ...(decoded as { userId: string; username: string }) };

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
        const {
          address,
          email,
          name,
          phone,
          profilePicture,
          userId,
          username,
        } = value;

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
    }
  } catch (error) {
    if (error instanceof TokenError) {
      return {
        body: JSON.stringify({
          data: null,
          message: `${error.code}: ${error.message}`,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 401,
      };
    } else if (error.$metadata && error.$metadata.httpStatusCode) {
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
