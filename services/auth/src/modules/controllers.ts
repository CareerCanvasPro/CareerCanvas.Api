import { DB } from "@career-canvas/utility/db";
import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { Axios, Cognito } from "./services";

export class AuthController {
  private readonly axios = new Axios();
  private readonly cognito = new Cognito();
  private readonly db = new DB();

  // Signup new user without initial signin
  public async handleSignUp(req: Request, res: Response): Promise<void> {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      res.status(422).json({ data: null, message: result.array() });
      return;
    }

    const { email, password } = req.body;

    const userAttributes = [{ Name: "email", Value: email }];

    try {
      const { $metadata: metaData, UserSub: userSub } =
        await this.cognito.handleSignUp(password, userAttributes, email);

      res.status(metaData.httpStatusCode).json({
        data: {
          metaData,
          userSub,
        },
        message: "User registered successfully",
      });
    } catch (error) {
      const { httpStatusCode, message } = this.cognito.handleError(error);

      if (httpStatusCode && message) {
        res.status(httpStatusCode).json({ data: null, message });
        return;
      }

      res.status(500).json({ data: null, message: error.message });
    }
  }

  public async handleSignIn(req: Request, res: Response): Promise<void> {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      res.status(422).json({ data: null, message: result.array() });
      return;
    }

    const { email, password } = req.body;

    try {
      const {
        AuthenticationResult: authenticationResult,
        $metadata: { httpStatusCode },
      } = await this.cognito.handleSignIn(password, email);

      res.status(httpStatusCode).json({
        data: { authenticationResult },
        message: "User logged in successfully",
      });
    } catch (error) {
      const { httpStatusCode, message } = this.cognito.handleError(error);

      if (httpStatusCode && message) {
        res.status(httpStatusCode).json({ data: null, message });
        return;
      }

      res.status(500).json({ data: null, message: error.message });
    }
  }

  public async verifySignIn(req: Request, res: Response): Promise<void> {
    const user = req.body.user;
    res.status(200).json({ "Data ": user });
  }

  public async handleConfirmSignUp(req: Request, res: Response): Promise<void> {
    // Validate the request input
    const result = validationResult(req);

    if (!result.isEmpty()) {
      res.status(422).json({ data: null, message: result.array() });
      return;
    }

    const { confirmationCode, email } = req.body;

    try {
      const { $metadata: metaData } = await this.cognito.handleConfirmSignUp(
        confirmationCode,
        email
      );

      res.status(metaData.httpStatusCode).json({
        data: {
          metaData,
        },
        message: "User registration confirmed successfully",
      });
    } catch (error) {
      const { httpStatusCode, message } = this.cognito.handleError(error);

      if (httpStatusCode && message) {
        res.status(httpStatusCode).json({ data: null, message });
        return;
      }

      res.status(500).json({ data: null, message: error.message });
    }
  }

  public async handleResendConfirmationCode(
    req: Request,
    res: Response
  ): Promise<void> {
    const { email } = req.body;

    try {
      const { $metadata: metaData } =
        await this.cognito.handleResendConfirmationCode(email);

      res.status(metaData.httpStatusCode).json({
        data: metaData,
        message: "Confirmation code resent successfully",
      });
    } catch (error) {
      const { httpStatusCode, message } = this.cognito.handleError(error);

      if (httpStatusCode && message) {
        res.status(httpStatusCode).json({ data: null, message });
        return;
      }

      res.status(500).json({ data: null, message: error.message });
    }
  }

  // Forgot Password
  public async handleForgotPassword(
    req: Request,
    res: Response
  ): Promise<void> {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      res.status(422).json({ data: null, message: result.array() });
      return;
    }

    const { email } = req.body;

    try {
      const { $metadata: metaData } = await this.cognito.handleForgotPassword(
        email
      );

      res.status(metaData.httpStatusCode).json({
        data: metaData,
        message: "Forgot password request sent successfully",
      });
    } catch (error) {
      const { httpStatusCode, message } = this.cognito.handleError(error);

      if (httpStatusCode && message) {
        res.status(httpStatusCode).json({ data: null, message });
        return;
      }

      res.status(500).json({ data: null, message: error.message });
    }
  }

  // Confirm Forgot password after request forgot password
  public async handleConfirmForgotPassword(
    req: Request,
    res: Response
  ): Promise<void> {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      res.status(422).json({ data: null, message: result.array() });
      return;
    }

    const { confirmationCode, email, password } = req.body;

    try {
      const output = await this.cognito.handleConfirmForgotPassword(
        confirmationCode,
        password,
        email
      );

      const metaData = output.$metadata;

      const httpStatusCode = metaData.httpStatusCode;

      res.status(httpStatusCode).json({
        data: metaData,
        message: "New password confirmed successfully",
      });
    } catch (error) {
      const { httpStatusCode, message } = this.cognito.handleError(error);

      if (httpStatusCode && message) {
        res.status(httpStatusCode).json({ data: null, message });
        return;
      }

      res.status(500).json({ data: null, message: error.message });
    }
  }

  // email change request
  public async handleUpdateEmail(req: Request, res: Response): Promise<void> {
    const result = validationResult(req.body);

    if (!result.isEmpty()) {
      res.status(422).json({ data: null, message: result.array() });
      return;
    }

    const { email } = req.body;

    const accessToken = req.headers.authorization;

    try {
      const output = await this.cognito.handleUpdateEmail(accessToken, email);

      const metaData = output.$metadata;

      const httpStatusCode = metaData.httpStatusCode;

      res.status(httpStatusCode).json({
        data: metaData,
        message: "Email change request sent successfully",
      });
    } catch (error) {
      const { httpStatusCode, message } = this.cognito.handleError(error);

      if (httpStatusCode && message) {
        res.status(httpStatusCode).json({ data: null, message });
        return;
      }

      res.status(500).json({ data: null, message: error.message });
    }
  }

  public async handleVerifyEmail(req: Request, res: Response): Promise<void> {
    const result = validationResult(req.body);

    if (!result.isEmpty()) {
      res.status(422).json({ data: null, message: result.array() });
      return;
    }

    const { confirmationCode, email } = req.body;

    const accessToken = req.headers.authorization;

    try {
      const output = await this.cognito.handleVerifyEmail(
        accessToken,
        confirmationCode
      );

      const metaData = output.$metadata;

      const httpStatusCode = metaData.httpStatusCode;

      await this.axios.updateItem(accessToken, { email });

      res.status(httpStatusCode).json({
        data: metaData,
        message: "Email change verified successfully",
      });
    } catch (error) {
      const { httpStatusCode, message } = this.cognito.handleError(error);

      if (httpStatusCode && message) {
        res.status(httpStatusCode).json({ data: null, message });
        return;
      }

      if (error.response && error.response.status) {
        res
          .status(error.response.status)
          .json({ data: null, message: error.message });
        return;
      }

      res.status(500).json({ data: null, message: error.message });
    }
  }

  public async getIpFromRequest(req: Request) {
    try {
      // Check 'x-forwarded-for' header first
      const forwardedForHeader = req.headers["x-forwarded-for"];
      let clientIp: string | undefined;

      if (forwardedForHeader) {
        // The 'x-forwarded-for' header may contain multiple IP addresses separated by commas.
        // The client's IP address is usually the first one.
        const forwardedIps: string[] = forwardedForHeader.split(",");
        clientIp = forwardedIps[0].trim();
      } else {
        // If 'x-forwarded-for' header is not available, try 'x-real-ip'
        clientIp = req.headers["x-real-ip"];
      }

      if (!clientIp) {
        // If neither 'x-forwarded-for' nor 'x-real-ip' headers are present, use req.connection.remoteAddress
        clientIp = req.connection.remoteAddress;
      }

      return clientIp;
    } catch (error) {
      console.error("Error:", error);
      return error;
    }
  }
}
