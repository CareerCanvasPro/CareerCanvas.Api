import express, { RequestHandler } from "express";

import { IRoute } from "./types";

export class App {
  private readonly app = express();

  constructor(private readonly config: { port: number }) {}

  public initMiddlewares(middlewares: RequestHandler[]): void {
    this.app.use(middlewares);
  }

  public initRoutes(routes: IRoute[]): void {
    routes.forEach((route) => {
      this.app.use(route.path, route.router);
    });
  }

  public listen(): void {
    this.app.listen(this.config.port, () => {
      console.log(`App listening on port ${this.config.port}`);
    });
  }
}
