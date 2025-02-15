import { Router } from "express";

import { AuthController } from "../controllers";

export class AuthRoute {
  private readonly authController = new AuthController();

  public path = "/";

  public router = Router();

  constructor() {
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.post("/auth", this.authController.handleAuth);

    this.router.post("/auth-otp", this.authController.handleAuthOTP);

    this.router.get("/auth/confirm", this.authController.handleConfirmAuth);
  }
}
