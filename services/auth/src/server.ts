import App from "./app";
import * as bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";

import AuthRoutes from "./modules/route";
import config from "../config";
const app = new App({
  port: config.port,
  routes: [new AuthRoutes()],
  middleWares: [
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    morgan("dev"),
    cors(),
  ],
});

app.listen();
