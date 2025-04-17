import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { hash } from "bcryptjs";
import { TokenError, createVerifier } from "fast-jwt";

import { createAdmin, findAdmin } from "./admins.db.service";
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
      const { name, password, token } = value;

      const verify = createVerifier({
        key: async () => process.env.ADMIN_JWT_SECRET,
      });

      const { email } = await verify(token);

      const { admin } = await findAdmin({ email });

      if (admin) {
        return {
          body: JSON.stringify({
            data: null,
            message: "Admin profile already exists",
          }),
          headers: {
            "Content-Type": "application/json",
          },
          statusCode: 409,
        };
      } else {
        const hashedPassword = await hash(password, 10);

        const admin = { email, hashedPassword, name };

        await createAdmin({ admin });

        return {
          body: JSON.stringify({
            data: null,
            message: "New admin profile created successfully",
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
      if (error.code === "FAST_JWT_EXPIRED") {
        return {
          body: JSON.stringify({ data: null, message: "Link has expired" }),
          headers: {
            "Content-Type": "application/json",
          },
          statusCode: 401,
        };
      } else {
        return {
          body: JSON.stringify({ data: null, message: "Invalid link" }),
          headers: {
            "Content-Type": "application/json",
          },
          statusCode: 401,
        };
      }
    } else {
      return {
        body: JSON.stringify({ data: null, message: "Internal server error" }),
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 500,
      };
    }
  }
};
