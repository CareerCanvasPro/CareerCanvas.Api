import { join } from "path";

import { renderFile } from "ejs";
import { Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import otpGenerator from "otp-generator";
import { v4 as uuidv4 } from "uuid";

import { DB } from "../../../../../utility/db";
import { Nodemailer } from "../../../../../utility/nodemailer";
import { SNS } from "../../../../../utility/sns";
import { config } from "../../config";
import { cleanMessage } from "../../utils";
import { emailSchema, phoneSchema } from "../schemas";
import { OtpsDB } from "../services";

interface ITokenPayload {
  username: string;
}

export class AuthController {
  private readonly db = new DB();

  private readonly nodemailer = new Nodemailer();

  private readonly sns = new SNS();

  private readonly otpsDB = new OtpsDB();

  public handleRequestMagicLink = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { error, value } = emailSchema.validate(req.body, {
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
          { username: email },
          config.aws.clientSecret,
          {
            expiresIn: "15m",
          },
          async (error, token) => {
            if (error) {
              throw error;
            } else {
              const magicLink = `https://auth.api.careercanvas.pro/auth/magic-link/verify?token=${token}`;

              await this.nodemailer.sendMail({
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
                subject: "Magic Link to Career Canvas",
                text: `Copy and paste the link below into your browser to access your account:\n\t${magicLink}`,
                to: email,
              });

              res.status(200).json({
                data: null,
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
  };

  public handleRequestEmailOtp = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { error, value } = emailSchema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        const validationErrors = error.details.map((error) =>
          cleanMessage(error.message)
        );

        res.status(400).json({ data: null, message: validationErrors });
      } else {
        const { email } = value;

        const otp = otpGenerator.generate(6, {
          digits: true,
          lowerCaseAlphabets: false,
          specialChars: false,
          upperCaseAlphabets: false,
        });

        await this.nodemailer.sendMail({
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
              "email-otp.ejs"
            ),
            { otp }
          ),
          subject: "OTP for Career Canvas Account Verification",
          text: `Your One-Time Password (OTP) for Career Canvas account verification is ${otp}.`,
          to: email,
        });

        await this.otpsDB.putOtp({ otp, username: email });

        res.status(200).json({
          data: null,
          message: "OTP sent to given email successfully",
        });
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
  };

  public handleRequestSmsOtp = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { error, value } = phoneSchema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        const validationErrors = error.details.map((error) =>
          cleanMessage(error.message)
        );

        res.status(400).json({ data: null, message: validationErrors });
      } else {
        const { phone } = value;

        const otp = otpGenerator.generate(6, {
          digits: true,
          lowerCaseAlphabets: false,
          specialChars: false,
          upperCaseAlphabets: false,
        });

        const { httpStatusCode } = await this.sns.sendSMS({
          message: `Your One-Time Password (OTP) for Career Canvas account verification is ${otp}. Don't share this OTP with anyone. This is confidential information intended only for you. If you did not request this OTP, please contact our support team immediately at support@careercanvas.pro`,
          phoneNumber: phone,
        });

        await this.otpsDB.putOtp({
          otp,
          username: phone,
        });

        res.status(httpStatusCode).json({
          data: null,
          message: "OTP sent to given phone number successfully",
        });
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
  };

  public handleVerifyMagicLink = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { token } = req.query;

      verify(
        token as string,
        config.aws.clientSecret,
        async (error: unknown, { username }: ITokenPayload) => {
          if (error) {
            throw error;
          } else {
            const { items: users } = await this.db.scanItems({
              attribute: { name: "username", value: username },
              tableName: "userprofiles",
            });

            const isNewUser = !users.length; // Return coins if user is new

            const userID = isNewUser ? uuidv4() : users[0].userID;

            sign(
              {
                userID,
                username,
              },
              config.aws.clientSecret,
              {
                expiresIn: "7d",
              },
              (error, accessToken) => {
                if (error) {
                  throw error;
                } else {
                  res
                    .status(301)
                    .redirect(
                      `https://careercanvas.pro/auth/callback?token=${accessToken}&isNewUser=${isNewUser}&username=${username}&expiresAt=${
                        Date.now() + 604800000
                      }`
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
  };

  public handleVerifyOtp = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { otp } = req.query;

      const { otps } = await this.otpsDB.scanOtps({
        attribute: { name: "otp", value: otp },
      });

      if (otps.length) {
        const [userOtp] = otps;

        if ((userOtp.expiresAt as number) >= Math.floor(Date.now() / 1000)) {
          const { items: users } = await this.db.scanItems({
            attribute: { name: "username", value: userOtp.username },
            tableName: "userprofiles",
          });

          const isNewUser = !users.length; // Return coins if user is new

          const userID = isNewUser ? uuidv4() : users[0].userID;

          sign(
            {
              userID,
              username: userOtp.username,
            },
            config.aws.clientSecret,
            {
              expiresIn: "7d",
            },
            (error, accessToken) => {
              if (error) {
                throw error;
              } else {
                res.status(200).json({
                  data: {
                    accessToken,
                    expiresAt: Date.now() + 604800000,
                    isNewUser,
                    username: userOtp.username,
                  },
                  message: "OTP verified successfully",
                });
              }
            }
          );
        } else {
          res.status(401).json({ data: null, message: "OTP has expired" });
        }
      } else {
        res.status(401).json({ data: null, message: "Invalid OTP" });
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
  };

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
