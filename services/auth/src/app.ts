import { join } from "path";

import express, { RequestHandler } from "express";

import { handleNotFound } from "./modules/middlewares";
import { IRoute } from "./types";

export class App {
  private readonly app = express();

  constructor(private readonly config: { port: number }) {}

  public initTemplates = (): void => {
    this.app.set("view engine", "ejs");
    this.app.set("views", join(__dirname, "..", "src", "views"));
  };

  public initMiddlewares = (middlewares: RequestHandler[]): void => {
    this.app.use(middlewares);
  };

  public initRoutes = (routes: IRoute[]): void => {
    routes.forEach((route) => {
      this.app.use(route.path, route.router);
    });
  };

  public initNotFound = (): void => {
    this.app.use(handleNotFound);
  };

  public listen = (): void => {
    this.app.listen(this.config.port, () => {
      console.log(`App listening on port ${this.config.port}`);
    });
  };
}
