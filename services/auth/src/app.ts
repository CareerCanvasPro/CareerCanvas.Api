import { join } from "path";

import express from "express";

import { handleNotFound } from "./modules/middlewares";
import { IRoute } from "./types";

interface AppConstructorParams {
  port: number;
}

export class App {
  private readonly app = express();

  private readonly port: number;

  constructor({ port }: AppConstructorParams) {
    this.port = port;
  }

  public initTemplates(): void {
    this.app.set("view engine", "ejs");
    this.app.set(
      "views",
      join(__dirname, "..", "..", "..", "..", "src", "views")
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public initMiddlewares(middlewares: any[]): void {
    this.app.use(middlewares);
  }

  public initRoutes(routes: IRoute[]): void {
    routes.forEach((route) => {
      this.app.use(route.path, route.router);
    });
  }

  public initNotFound(): void {
    this.app.use(handleNotFound);
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`App listening on port ${this.port}`);
    });
  }
}
