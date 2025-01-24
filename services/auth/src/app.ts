import { IRoute } from "@career-canvas/types";
import express from "express";

export class App {
  private readonly app = express();

  constructor(private readonly port: number) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public initMiddlewares(middlewares: any[]): void {
    this.app.use(middlewares);
  }

  public initRoutes(routes: IRoute[]): void {
    routes.forEach((route) => {
      this.app.use(route.path, route.router);
    });
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`App listening on port ${this.port}`);
    });
  }
}
