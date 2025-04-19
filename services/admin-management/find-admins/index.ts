import { APIGatewayProxyResult } from "aws-lambda";

import { findAdmins } from "./admins.db.service";

export const handler = async (): Promise<APIGatewayProxyResult> => {
  try {
    const { admins } = await findAdmins();

    return {
      body: JSON.stringify({
        data: { admins },
        message: "All admin profiles retrieved successfully",
      }),
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 200,
    };
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
