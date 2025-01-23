import { json, urlencoded } from "body-parser";
import cors from "cors";
import morgan from "morgan";

import { config } from "../config";

import { App } from "./app";
import { AuthRoutes } from "./modules/routes";
const app = new App({
  middleWares: [
    json(),
    urlencoded({
      extended: true,
    }),
    morgan("dev"),
    cors(),
  ],
  port: config.port,
  routes: [new AuthRoutes()],
});

app.listen();
