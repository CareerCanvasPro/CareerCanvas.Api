import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { createServer, proxy } from "aws-serverless-express";

import { app } from "./server";

const server = createServer(app);

export const handler = (event: APIGatewayProxyEvent, context: Context) => {
  proxy(server, event, context);
};
