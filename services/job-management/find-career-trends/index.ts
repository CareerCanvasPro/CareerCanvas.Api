import { APIGatewayProxyResult } from "aws-lambda";

import { findCareerTrends } from "./career-trends.db.service";

export const handler = async (): Promise<APIGatewayProxyResult> => {
  try {
    const { careerTrends } = await findCareerTrends();

    if (careerTrends) {
      return {
        body: JSON.stringify({
          data: { careerTrends },
          message: "Career trends retrieved successfully",
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
          message: "Career trends not found",
        }),
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 404,
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
