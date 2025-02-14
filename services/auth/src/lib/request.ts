import { APIGatewayProxyEvent } from "aws-lambda";

export const request = {
  getBody: <T = any>(event: APIGatewayProxyEvent): T => {
    return JSON.parse(event.body || "{}");
  }
};