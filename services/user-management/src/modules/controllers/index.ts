import { Request, Response } from "express";

import { cleanMessage } from "../../utils";
import { appreciationSchema, stringSchema } from "../schemas";
import { Axios, UsersDb } from "../services";

export class UserManagementController {
  private readonly axios = new Axios();

  private readonly usersDb = new UsersDb();

  public handleUpdateUserFcmToken = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { fcmToken, userId } = req.body;

      const { error, value: validatedFcmToken } = stringSchema.validate(
        fcmToken,
        {
          abortEarly: false,
        }
      );

      if (error) {
        const validationErrors = error.details.map((error) =>
          cleanMessage(error.message)
        );

        res.status(400).json({ data: null, message: validationErrors });
      } else {
        await this.usersDb.updateUserFcmToken({
          fcmToken: validatedFcmToken,
          id: userId,
        });

        res
          .status(200)
          .json({ data: null, message: "FCM token updated successfully" });
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

  // APPRECIATIONS

  public handleCreateUserAppreciation = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { appreciation, userId } = req.body;

      const { error, value: validatedAppreciation } =
        appreciationSchema.validate(appreciation, {
          abortEarly: false,
        });

      if (error) {
        const validationErrors = error.details.map((error) =>
          cleanMessage(error.message)
        );

        res.status(400).json({ data: null, message: validationErrors });
      } else {
        await this.usersDb.createUserAppreciation({
          appreciation: validatedAppreciation,
          id: userId,
        });

        res
          .status(200)
          .json({ data: null, message: "Appreciation created successfully" });
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

  public handleDeleteUserAppreciation = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        body: { userId },
        params: { appreciationId },
      } = req;

      await this.usersDb.deleteUserAppreciation({
        appreciationId,
        id: userId,
      });

      res
        .status(200)
        .json({ data: null, message: "Appreciation deleted successfully" });
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

  public handleUpdateUserAppreciation = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        body: { appreciation, userId },
        params: { appreciationId },
      } = req;

      const { error, value: validatedAppreciation } =
        appreciationSchema.validate(appreciation, {
          abortEarly: false,
        });

      if (error) {
        const validationErrors = error.details.map((error) =>
          cleanMessage(error.message)
        );

        res.status(400).json({ data: null, message: validationErrors });
      } else {
        await this.usersDb.updateUserAppreciation({
          appreciation: validatedAppreciation,
          appreciationId,
          id: userId,
        });

        res
          .status(200)
          .json({ data: null, message: "Appreciation updated successfully" });
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
}
