import { join } from "path";

import { renderFile } from "ejs";
import { Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import { DB } from "../../../../../utility/db";
import { SES } from "../../../../../utility/ses";
import { config } from "../../config";
import { cleanMessage } from "../../utils";
import { authSchema } from "../schemas";

interface ITokenPayload {
  email: string;
}

export class AuthController {
  public async handleAuth(req: Request, res: Response): Promise<void> {
    try {
      const ses = new SES();

      const { error, value } = authSchema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        const validationErrors = error.details.map((error) =>
          cleanMessage(error.message)
        );

        res.status(400).json({ data: null, message: validationErrors });
      } else {
        const { email } = value;

        sign(
          { email },
          config.aws.cognito.clientSecret,
          {
            expiresIn: "1d", // TODO: Change after testing
          },
          async (error, token) => {
            if (error) {
              throw error;
            } else {
              const magicLink = `http://13.229.30.167:5000/auth/confirm?token=${token}`;

              const {
                $metadata: { httpStatusCode },
              } = await ses.sendEmail({
                body: {
                  html: await renderFile(
                    join(
                      __dirname,
                      "..",
                      "..",
                      "..",
                      "..",
                      "..",
                      "..",
                      "src",
                      "views",
                      "email.ejs"
                    ),
                    { magicLink }
                  ),
                  text: `Copy and paste the link below into your browser to access your account:\n\t${magicLink}`,
                },
                destination: [email as string],
                source: "sadiaiffatjahan@gmail.com",
                subject: "Magic Link to Career Canvas",
              });

              res.status(httpStatusCode).json({
                data: { email, token }, // TODO: Remove after testing
                message: "Magic link sent to given email successfully",
              });
            }
          }
        );
      }
    } catch (error) {
      if (error.$metadata && error.$metadata.httpStatusCode) {
        res
          .status(error.$metadata.httpStatusCode)
          .json({ data: null, message: `${error.name}: ${error.message}` });
      } else {
        res
          .status(500)
          .json({ data: null, message: `${error.name}: ${error.message}` });
      }
    }
  }

  public async handleConfirmAuth(req: Request, res: Response): Promise<void> {
    try {
      const db = new DB();

      const { token } = req.query;

      verify(
        token as string,
        config.aws.cognito.clientSecret,
        async (error: unknown, { email }: ITokenPayload) => {
          if (error) {
            throw error;
          } else {
            const { items: users } = await db.scanItems({
              attribute: { name: "email", value: email },
              tableName: "userprofiles",
            });

            const isNewUser = !users.length;

            const userID = isNewUser ? uuidv4() : users[0].userID;

            sign(
              { email, userID },
              config.aws.cognito.clientSecret,
              {
                expiresIn: "1d", // TODO: Change to 15m if refresh token is not required
              },
              (error, accessToken) => {
                if (error) {
                  throw error;
                } else {
                  res
                    .status(301)
                    .redirect(
                      `https://careercanvas.pro/auth/callback?token=${accessToken}&isNewUser=${isNewUser}&email=${email}`
                    );
                }
              }
            );
          }
        }
      );
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        res.status(401).render("error", {
          message: "401 Unauthorized | Invalid link",
          title: "401 Unauthorized",
        });
      } else if (error.name === "TokenExpiredError") {
        res.status(401).render("error", {
          message: "401 Unauthorized | Link has expired",
          title: "401 Unauthorized",
        });
      } else {
        res.status(500).render("error", {
          message: "500 Internal Server Error",
          title: "500 Internal Server Error",
        });
      }
    }
  }

  // Signup new user without initial signin
  // public async handleSignUp(req: Request, res: Response): Promise<void> {
  //   const db = new DB();

  //   const { user } = req.body;

  //   try {
  //     const { httpStatusCode, newItem } = await db.putItem({
  //       item: user,
  //       tableName: "users",
  //     });

  //     res.status(httpStatusCode).json({
  //       data: {
  //         newItem,
  //       },
  //       message: "User registered successfully",
  //     });
  //   } catch (error) {
  //     res.status(500).json({ data: null, message: error.message });
  //   }
  // }

  // public async handleConfirmSignUp(req: Request, res: Response): Promise<void> {
  //   // Validate the request input
  //   const validationErrors = validationResult(req);

  //   if (!validationErrors.isEmpty()) {
  //     res.status(422).json({ data: null, message: validationErrors.array() });
  //     return;
  //   }

  //   const { confirmationCode, email } = req.body;

  //   const cognito = new Cognito();

  //   try {
  //     const {
  //       $metadata: { httpStatusCode },
  //     } = await cognito.handleConfirmSignUp(confirmationCode, email);

  //     res.status(httpStatusCode).json({
  //       data: {
  //         email,
  //       },
  //       message: "User registration confirmed successfully",
  //     });
  //   } catch (error) {
  //     const { httpStatusCode, message } = cognito.handleError(error);

  //     if (httpStatusCode && message) {
  //       res.status(httpStatusCode).json({ data: null, message });
  //     } else {
  //       res.status(500).json({ data: null, message: error.message });
  //     }
  //   }
  // }

  // // Forgot Password
  // public async handleForgotPassword(
  //   req: Request,
  //   res: Response
  // ): Promise<void> {
  //   const validationErrors = validationResult(req);

  //   if (!validationErrors.isEmpty()) {
  //     res.status(422).json({ data: null, message: validationErrors.array() });
  //     return;
  //   }

  //   const { email } = req.body;

  //   const cognito = new Cognito();

  //   try {
  //     const {
  //       $metadata: { httpStatusCode },
  //       CodeDeliveryDetails,
  //     } = await cognito.handleForgotPassword(email);

  //     res.status(httpStatusCode).json({
  //       data: CodeDeliveryDetails,
  //       message: "Forgot password request sent successfully",
  //     });
  //   } catch (error) {
  //     const { httpStatusCode, message } = cognito.handleError(error);

  //     if (httpStatusCode && message) {
  //       res.status(httpStatusCode).json({ data: null, message });
  //     } else {
  //       res.status(500).json({ data: null, message: error.message });
  //     }
  //   }
  // }

  // // Confirm Forgot password after request forgot password
  // public async handleConfirmForgotPassword(
  //   req: Request,
  //   res: Response
  // ): Promise<void> {
  //   const validationErrors = validationResult(req);

  //   if (!validationErrors.isEmpty()) {
  //     res.status(422).json({ data: null, message: validationErrors.array() });
  //     return;
  //   }

  //   const { confirmationCode, email, password } = req.body;

  //   const cognito = new Cognito();

  //   try {
  //     const output = await cognito.handleConfirmForgotPassword(
  //       confirmationCode,
  //       email,
  //       password
  //     );

  //     res.status(output.$metadata.httpStatusCode).json({
  //       data: output,
  //       message: "New password confirmed successfully",
  //     });
  //   } catch (error) {
  //     const { httpStatusCode, message } = cognito.handleError(error);

  //     if (httpStatusCode && message) {
  //       res.status(httpStatusCode).json({ data: null, message });
  //     } else {
  //       res.status(500).json({ data: null, message: error.message });
  //     }
  //   }
  // }

  // public async handleResendConfirmationCode(
  //   req: Request,
  //   res: Response
  // ): Promise<void> {
  //   const { email } = req.body;

  //   try {
  //     const { $metadata: metaData } =
  //       await this.cognito.handleResendConfirmationCode(email);

  //     res.status(metaData.httpStatusCode).json({
  //       data: metaData,
  //       message: "Confirmation code resent successfully",
  //     });
  //   } catch (error) {
  //     const { httpStatusCode, message } = this.cognito.handleError(error);

  //     if (httpStatusCode && message) {
  //       res.status(httpStatusCode).json({ data: null, message });
  //       return;
  //     }

  //     res.status(500).json({ data: null, message: error.message });
  //   }
  // }

  // // email change request
  // public async handleUpdateEmail(req: Request, res: Response): Promise<void> {
  //   const validationErrors = validationResult(req.body);

  //   if (!validationErrors.isEmpty()) {
  //     res.status(422).json({ data: null, message: validationErrors.array() });
  //     return;
  //   }

  //   const { email } = req.body;

  //   const accessToken = req.headers.authorization.split(" ")[1];

  //   try {
  //     const output = await this.cognito.handleUpdateEmail(accessToken, email);

  //     const metaData = output.$metadata;

  //     const httpStatusCode = metaData.httpStatusCode;

  //     res.status(httpStatusCode).json({
  //       data: output,
  //       message: "Email change request sent successfully",
  //     });
  //   } catch (error) {
  //     const { httpStatusCode, message } = this.cognito.handleError(error);

  //     if (httpStatusCode && message) {
  //       res.status(httpStatusCode).json({ data: null, message });
  //       return;
  //     }

  //     res.status(500).json({ data: null, message: error.message });
  //   }
  // }

  // public async handleVerifyEmail(req: Request, res: Response): Promise<void> {
  //   const validationErrors = validationResult(req.body);

  //   if (!validationErrors.isEmpty()) {
  //     res.status(422).json({ data: null, message: validationErrors.array() });
  //     return;
  //   }

  //   const { confirmationCode } = req.body;

  //   const accessToken = req.headers.authorization;

  //   try {
  //     const output = await this.cognito.handleVerifyEmail(
  //       accessToken,
  //       confirmationCode
  //     );

  //     const metaData = output.$metadata;

  //     const httpStatusCode = metaData.httpStatusCode;

  //     // await this.axios.updateItem(accessToken, "profile", { email });

  //     res.status(httpStatusCode).json({
  //       data: metaData,
  //       message: "Email change verified successfully",
  //     });
  //   } catch (error) {
  //     const { httpStatusCode, message } = this.cognito.handleError(error);

  //     if (httpStatusCode && message) {
  //       res.status(httpStatusCode).json({ data: null, message });
  //       return;
  //     }

  //     if (error.response && error.response.status) {
  //       res
  //         .status(error.response.status)
  //         .json({ data: null, message: error.message });
  //       return;
  //     }

  //     res.status(500).json({ data: null, message: error.message });
  //   }
  // }
}
