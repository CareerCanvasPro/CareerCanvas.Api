import { Router } from "express";

export class HomeRoute {
  public readonly path = "/";

  public readonly router = Router();

  constructor() {
    this.initRoutes();
  }

  private initRoutes = (): void => {
    this.router.get("/", (req, res) => {
      res.status(200).json({
        message: "Career Canvas Auth Service",
        version: "1.0.0",
        endpoints: ["/auth/magic-link/request", "/auth/otp/request/email", "/auth/magic-link/verify", "/auth/otp/verify"],
        status: "running"
      });
    });
  };
}