import "module-alias/register";
import { json, urlencoded } from "body-parser";
import cors from "cors";
import morgan from "morgan";

import { App } from "../../../classes";

import { config } from "./config";
import { AuthRoute } from "./modules/routes";

function startServer(): void {
  try {
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
  } catch (error) {
    console.error(error.message);
  }
}

startServer();
