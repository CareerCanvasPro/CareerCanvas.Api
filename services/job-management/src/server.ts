import { json, urlencoded } from "body-parser";
import cors from "cors";
import morgan from "morgan";

import { App } from "./app";
import { config } from "./config";
import { JobManagementRoute } from "./modules/routes";

function startServer(): void {
  try {
    const app = new App({ port: config.port });

    app.initMiddlewares([
      json(),
      urlencoded({
        extended: true,
      }),
      morgan("dev"),
      cors(),
    ]);

    app.initRoutes([new JobManagementRoute()]);

    app.listen();
  } catch (error) {
    console.error(`${error.name}: ${error.message}`);
  }
}

startServer();
