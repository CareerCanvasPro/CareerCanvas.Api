import { json, urlencoded } from "body-parser";
import cors from "cors";
import { Express } from "express";
import morgan from "morgan";

import { App } from "./app";
import { config } from "./config";
import { AuthRoute } from "./modules/routes";

const startServer = (): { app: Express } => {
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

    return app.getApp();
  } catch (error) {
    console.error(`${error.name}: ${error.message}`);
  }
};

export const { app } = startServer();
