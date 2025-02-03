import { json, urlencoded } from "body-parser";
import cors from "cors";
import morgan from "morgan";

import { App } from "./app";
import { config } from "./config";
import { AuthRoute } from "./modules/routes";

function startServer(): void {
  try {
    const app = new App({ port: config.port });

    app.initTemplates();

    app.initMiddlewares([
      json(),
      urlencoded({
        extended: true,
      }),
      morgan("dev"),
      cors(),
    ]);

    app.initRoutes([new AuthRoute()]);

    app.initNotFound();

    app.listen();
  } catch (error) {
    console.error(`${error.name}: ${error.message}`);
  }
}

startServer();
