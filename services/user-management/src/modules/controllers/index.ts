import cuid from "cuid";
import { Request, Response } from "express";

import { config } from "../../config";
import { cleanMessage } from "../../utils";
import {
  appreciationSchema,
  educationArraySchema,
  educationSchema,
  occupationArraySchema,
  occupationSchema,
  resumeSchema,
  stringSchema,
} from "../schemas";
import { Axios, UsersDb } from "../services";

export class UserManagementController {
  private readonly axios = new Axios();

  private readonly usersDb = new UsersDb();

  public handleFindUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { authorization, userId } = req.body;

      const { user } = await this.usersDb.findUser({
        id: userId,
      });

      if (user) {
        const { educations, resumes } = user;

        for (const education of educations) {
          if (education.certificate) {
            const { certificate } = education;

            const {
              data: { data },
            } = await this.axios.get({
              authorization,
              url: `${config.baseUrl.media}/media/signed-url?key=${certificate.key}`,
            });

            certificate["url"] = data["signedUrl"];
          }
        }

        for (const resume of resumes) {
          const {
            data: { data },
          } = await this.axios.get({
            authorization,
            url: `${config.baseUrl.media}/media/signed-url?key=${resume.key}`,
          });

          resume["url"] = data["signedUrl"];
        }

        res
          .status(200)
          .json({ data: user, message: "Profile retrieved successfully" });
      } else {
        res.status(404).json({ data: null, message: "Profile not found" });
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

  // EDUCATIONS

  public handleCreateUserEducations = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { educations, userId } = req.body;

      const { error, value: validatedEducations } =
        educationArraySchema.validate(educations, {
          abortEarly: false,
        });

      if (error) {
        const validationErrors = error.details.map((error) =>
          cleanMessage(error.message)
        );

        res.status(400).json({ data: null, message: validationErrors });
      } else {
        for (const education of validatedEducations) {
          const { certificate } = education;

          delete education?.certificate;

          await this.usersDb.createUserEducation({
            certificate,
            education,
            id: userId,
          });
        }

        res
          .status(200)
          .json({ data: null, message: "Educations created successfully" });
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

  public handleDeleteUserEducation = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        body: { authorization, userId },
        params: { educationId },
        query: { key },
      } = req;

      await this.usersDb.deleteUserEducation({
        educationId,
        id: userId,
      });

      if (key) {
        await this.axios.delete({
          authorization,
          url: `${config.baseUrl.media}/media/certificate?key=${key}`,
        });
      }

      res
        .status(200)
        .json({ data: null, message: "Education deleted successfully" });
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

  public handleUpdateUserEducation = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        body: { education, userId },
        params: { educationId },
      } = req;

      const { error, value: validatedEducation } = educationSchema.validate(
        education,
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
        const { certificate } = validatedEducation;

        delete validatedEducation?.certificate;

        await this.usersDb.updateUserEducation({
          certificate,
          education: validatedEducation,
          educationId,
          id: userId,
        });

        res
          .status(200)
          .json({ data: null, message: "Education updated successfully" });
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

  // OCCUPATIONS

  public handleCreateUserOccupations = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { occupations, userId } = req.body;

      const { error, value: validatedOccupations } =
        occupationArraySchema.validate(occupations, {
          abortEarly: false,
        });

      if (error) {
        const validationErrors = error.details.map((error) =>
          cleanMessage(error.message)
        );

        res.status(400).json({ data: null, message: validationErrors });
      } else {
        await this.usersDb.createUserOccupations({
          id: userId,
          occupations: validatedOccupations,
        });

        res
          .status(200)
          .json({ data: null, message: "Occupations created successfully" });
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

  public handleDeleteUserOccupation = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        body: { userId },
        params: { occupationId },
      } = req;

      await this.usersDb.deleteUserOccupation({
        id: userId,
        occupationId,
      });

      res
        .status(200)
        .json({ data: null, message: "Occupation deleted successfully" });
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

  public handleUpdateUserOccupation = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        body: { occupation, userId },
        params: { occupationId },
      } = req;

      const { error, value: validatedOccupation } = occupationSchema.validate(
        occupation,
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
        await this.usersDb.updateUserOccupation({
          id: userId,
          occupation: validatedOccupation,
          occupationId,
        });

        res
          .status(200)
          .json({ data: null, message: "Occupation updated successfully" });
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

  // RESUMES

  public handleCreateUserResume = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { resume, userId } = req.body;

      const { error, value: validatedResume } = resumeSchema.validate(resume, {
        abortEarly: false,
      });

      if (error) {
        const validationErrors = error.details.map((error) =>
          cleanMessage(error.message)
        );

        res.status(400).json({ data: null, message: validationErrors });
      } else {
        const resumeId = cuid();

        await this.usersDb.createUserResume({
          id: userId,
          resume: { ...validatedResume, id: resumeId },
        });

        res.status(200).json({
          data: { ...validatedResume, resumeId },
          message: "Resume created successfully",
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

  public handleDeleteUserResume = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        body: { authorization, userId },
        params: { resumeId },
        query: { key },
      } = req;

      await this.usersDb.deleteUserResume({
        id: userId,
        resumeId,
      });

      const { data, status } = await this.axios.delete({
        authorization,
        url: `${config.baseUrl.media}/media/resume?key=${key}`,
      });

      res.status(status).json(data);
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
