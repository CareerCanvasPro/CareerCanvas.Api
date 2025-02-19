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
      "/otp/email/request",
      this.authController.handleRequestEmailOtp
    );

    this.router.post(
      "/otp/sms/request",
      this.authController.handleRequestSmsOtp
    );

    this.router.get(
      "/magic-link/verify",
      this.authController.handleVerifyMagicLink
    );

    this.router.get(
      "/otp/email/verify",
      this.authController.handleVerifyEmailOtp
    );

    this.router.get("/otp/sms/verify", this.authController.handleVerifySmsOtp);
  }
}
