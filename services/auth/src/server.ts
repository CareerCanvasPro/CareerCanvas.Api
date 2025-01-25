import { App } from "@career-canvas/classes";
import { json, urlencoded } from "body-parser";
import cors from "cors";
import morgan from "morgan";

import { config } from "./config";
import { AuthRoute } from "./modules/routes";

const app = new App(config.port);

app.initMiddlewares([
  json(),
  urlencoded({
    extended: true,
  }),
  morgan("dev"),
  cors(),
]);

app.initRoutes([new AuthRoute()]);

app.listen();
