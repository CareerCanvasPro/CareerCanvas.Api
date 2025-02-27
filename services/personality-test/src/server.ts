import { json, urlencoded } from "body-parser";
import cors from "cors";
import morgan from "morgan";

import { App } from "./app";
import { client, config } from "./config";
import { PersonalityTestRoute } from "./modules/routes";

const startServer = async (): Promise<void> => {
  try {
    await client
      .connect()
      .then(() => {
        console.log("Connected to the PostgreSQL database!");
      })
      .catch((error) => {
        console.error("Error connecting to the database:", error);
      });

    const app = new App({ port: config.port });

    app.initMiddlewares([
      json(),
      urlencoded({
        extended: true,
      }),
      morgan("dev"),
      cors(),
    ]);

    app.initRoutes([new PersonalityTestRoute()]);

    app.listen();
  } catch (error) {
    console.error(`${error.name}: ${error.message}`);
  }
};

startServer();
