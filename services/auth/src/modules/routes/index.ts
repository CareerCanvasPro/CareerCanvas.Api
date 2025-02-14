import { Router } from "express";

import { AuthController } from "../controllers";

export class AuthRoute {
  private readonly authController = new AuthController();

  public path = "/auth";

  public router = Router();

  constructor() {
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.post("/", this.authController.handleAuth);

    this.router.get("/confirm", this.authController.handleConfirmAuth);
  }
}
