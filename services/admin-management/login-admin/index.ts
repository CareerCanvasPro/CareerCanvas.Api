import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { compare } from "bcrypt";
import { createSigner } from "fast-jwt";

import { findAdmin } from "./admins.db.service";
import { cleanMessage } from "./utils";
import { adminValidator } from "./validators";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body ? event.body : "");

    const { error, value } = adminValidator.validate(body, {
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
      const { email, password } = value;

      const { admin } = await findAdmin({ email });

      if (admin) {
        const { id: adminId, hashedPassword, name } = admin;

        const isPasswordValid = await compare(password, hashedPassword);

        if (isPasswordValid) {
          const sign = createSigner({
            expiresIn: "7d",
            key: async () => process.env.ADMIN_JWT_SECRET,
          });

          const accessToken = await sign({
            adminId,
            email,
          });

          return {
            body: JSON.stringify({
              data: {
                accessToken,
                adminId,
                email,
                expiresAt: Date.now() + 604800000,
                name,
              },
              message: "Admin logged in successfully",
            }),
            headers: {
              "Content-Type": "application/json",
            },
            statusCode: 200,
          };
        } else {
          return {
            body: JSON.stringify({
              data: null,
              message: "Invalid credentials",
            }),
            headers: {
              "Content-Type": "application/json",
            },
            statusCode: 401,
          };
        }
      } else {
        return {
          body: JSON.stringify({
            data: null,
            message: "Invalid credentials",
          }),
          headers: {
            "Content-Type": "application/json",
          },
          statusCode: 401,
        };
      }
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
