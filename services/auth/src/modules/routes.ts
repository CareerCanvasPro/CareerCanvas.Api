import { Router } from "express";

import { AuthController } from "./controllers";

export class AuthRoute {
  private readonly authController = new AuthController();
  public path = "/auth";
  public router = Router();

  constructor() {
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.post("/sign-up", this.authController.handleSignUp);
    this.router.post("/sign-in", this.authController.handleSignIn);
    this.router.post(
      "/confirm-sign-up",
      this.authController.handleConfirmSignUp
    );
    this.router.post(
      "/forgot-password",
      this.authController.handleForgotPassword
    );
    this.router.post(
      "/confirm-forgot-password",
      this.authController.handleConfirmForgotPassword
    );
    this.router.post("/update-email", this.authController.handleUpdateEmail);
    this.router.post("/verify-email", this.authController.handleVerifyEmail);
    this.router.post(
      "/resend-confirmation-code",
      this.authController.handleResendConfirmationCode
    );
  }
}
