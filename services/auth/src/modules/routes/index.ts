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
    this.router.post(
      "/magic-link/request",
      this.authController.handleRequestMagicLink
    );

    this.router.post(
      "/otp/request/email",
      this.authController.handleRequestEmailOtp
    );

    this.router.post(
      "/otp/request/sms",
      this.authController.handleRequestSmsOtp
    );

    this.router.get(
      "/magic-link/verify",
      this.authController.handleVerifyMagicLink
    );

    this.router.get("/otp/verify", this.authController.handleVerifyOtp);
  }
}
