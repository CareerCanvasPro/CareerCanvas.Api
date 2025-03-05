import { Request, Response } from "express";

import { cleanMessage } from "../../utils";
import {
  appreciationArraySchema,
  appreciationSchema,
  educationArraySchema,
  educationCertificateSchema,
  educationSchema,
  occupationArraySchema,
  occupationSchema,
  resumeArraySchema,
  resumeSchema,
  stringArraySchema,
  stringSchema,
  urlSchema,
  userSchema,
} from "../schemas";
import { UsersDb } from "../services";

export class UserManagementController {
  private readonly usersDb = new UsersDb();

  public handleCreateUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      delete req.body.exp;

      delete req.body.iat;

      const { error, value } = userSchema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        const validationErrors = error.details.map((error) =>
          cleanMessage(error.message)
        );

        res.status(400).json({ data: null, message: validationErrors });
      } else {
        const {
          address,
          email,
          name,
          phone,
          profilePicture,
          userId,
          username,
        } = value;

        const coins = 10;

        await this.usersDb.createUser({
          user: {
            address,
            coins,
            email,
            id: userId,
            name,
            phone,
            profilePicture,
            username,
          },
        });

        res.status(201).json({
          data: { coins },
          message: "New profile created successfully",
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

  public handleDeleteUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { userId } = req.body;

      await this.usersDb.deleteUser({
        id: userId,
      });

      res
        .status(200)
        .json({ data: null, message: "Profile deleted successfully" });
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

  public handleFindUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { userId } = req.body;

      const { user } = await this.usersDb.findUser({
        id: userId,
      });

      if (user) {
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

  public handleUpdateUserAboutMe = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { aboutMe, userId } = req.body;

      const { error, value: validatedAboutMe } = stringSchema.validate(
        aboutMe,
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
        await this.usersDb.updateUserAboutMe({
          aboutMe: validatedAboutMe,
          id: userId,
        });

        res
          .status(200)
          .json({ data: null, message: "About me updated successfully" });
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

  public handleUpdateUserAddress = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { address, userId } = req.body;

      const { error, value: validatedAddress } = stringSchema.validate(
        address,
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
        await this.usersDb.updateUserAddress({
          address: validatedAddress,
          id: userId,
        });

        res
          .status(200)
          .json({ data: null, message: "Address updated successfully" });
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

  public handleUpdateUserName = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { name, userId } = req.body;

      const { error, value: validatedName } = stringSchema.validate(name, {
        abortEarly: false,
      });

      if (error) {
        const validationErrors = error.details.map((error) =>
          cleanMessage(error.message)
        );

        res.status(400).json({ data: null, message: validationErrors });
      } else {
        await this.usersDb.updateUserName({
          id: userId,
          name: validatedName,
        });

        res
          .status(200)
          .json({ data: null, message: "Name updated successfully" });
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

  public handleUpdateUserProfilePicture = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { profilePicture, userId } = req.body;

      const { error, value: validatedProfilePicture } = urlSchema.validate(
        profilePicture,
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
        await this.usersDb.updateUserProfilePicture({
          id: userId,
          profilePicture: validatedProfilePicture,
        });

        res.status(200).json({
          data: null,
          message: "Profile picture updated successfully",
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

  // APPRECIATIONS

  public handleCreateUserAppreciations = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { appreciations, userId } = req.body;

      const { error, value: validatedAppreciations } =
        appreciationArraySchema.validate(appreciations, {
          abortEarly: false,
        });

      if (error) {
        const validationErrors = error.details.map((error) =>
          cleanMessage(error.message)
        );

        res.status(400).json({ data: null, message: validationErrors });
      } else {
        await this.usersDb.createUserAppreciations({
          appreciations: validatedAppreciations,
          id: userId,
        });

        res
          .status(200)
          .json({ data: null, message: "Appreciations created successfully" });
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
        await this.usersDb.createUserEducations({
          educations: validatedEducations,
          id: userId,
        });

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
        body: { userId },
        params: { educationId },
      } = req;

      await this.usersDb.deleteUserEducation({
        educationId,
        id: userId,
      });

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
        await this.usersDb.updateUserEducation({
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

  // EDUCATION CERTIFICATE

  public handleCreateUserEducationCertificate = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        body: { certificate, userId },
        params: { educationId },
      } = req;

      const { error, value: validatedCertificate } =
        educationCertificateSchema.validate(certificate, {
          abortEarly: false,
        });

      if (error) {
        const validationErrors = error.details.map((error) =>
          cleanMessage(error.message)
        );

        res.status(400).json({ data: null, message: validationErrors });
      } else {
        await this.usersDb.createUserEducationCertificate({
          certificate: validatedCertificate,
          educationId,
          id: userId,
        });

        res.status(200).json({
          data: null,
          message: "Education certificate created successfully",
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

  public handleDeleteUserEducationCertificate = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        body: { userId },
        params: { educationId },
      } = req;

      await this.usersDb.deleteUserEducationCertificate({
        educationId,
        id: userId,
      });

      res.status(200).json({
        data: null,
        message: "Education certificate deleted successfully",
      });
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

  public handleUpdateUserEducationCertificate = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        body: { certificate, userId },
        params: { educationId },
      } = req;

      const { error, value: validatedCertificate } =
        educationCertificateSchema.validate(certificate, {
          abortEarly: false,
        });

      if (error) {
        const validationErrors = error.details.map((error) =>
          cleanMessage(error.message)
        );

        res.status(400).json({ data: null, message: validationErrors });
      } else {
        await this.usersDb.updateUserEducationCertificate({
          certificate: validatedCertificate,
          educationId,
          id: userId,
        });

        res.status(200).json({
          data: null,
          message: "Education certificate updated successfully",
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

  // GOALS

  public handleCreateUserGoals = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { goals, userId } = req.body;

      const { error, value: validatedGoals } = stringArraySchema.validate(
        goals,
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
        await this.usersDb.createUserGoals({
          goals: validatedGoals,
          id: userId,
        });

        res
          .status(200)
          .json({ data: null, message: "Goals created successfully" });
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

  public handleDeleteUserGoal = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        body: { userId },
        params: { goalId },
      } = req;

      await this.usersDb.deleteUserGoal({
        goalId,
        id: userId,
      });

      res
        .status(200)
        .json({ data: null, message: "Goal deleted successfully" });
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

  public handleUpdateUserGoal = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        body: { goal, userId },
        params: { goalId },
      } = req;

      const { error, value: validatedGoal } = stringSchema.validate(goal, {
        abortEarly: false,
      });

      if (error) {
        const validationErrors = error.details.map((error) =>
          cleanMessage(error.message)
        );

        res.status(400).json({ data: null, message: validationErrors });
      } else {
        await this.usersDb.updateUserGoal({
          goal: validatedGoal,
          goalId,
          id: userId,
        });

        res
          .status(200)
          .json({ data: null, message: "Goal updated successfully" });
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

  // INTERESTS

  public handleCreateUserInterests = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { interests, userId } = req.body;

      const { error, value: validatedInterests } = stringArraySchema.validate(
        interests,
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
        await this.usersDb.createUserInterests({
          id: userId,
          interests: validatedInterests,
        });

        res
          .status(200)
          .json({ data: null, message: "Interests created successfully" });
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

  public handleDeleteUserInterest = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        body: { userId },
        params: { interestId },
      } = req;

      await this.usersDb.deleteUserInterest({
        id: userId,
        interestId,
      });

      res
        .status(200)
        .json({ data: null, message: "Interest deleted successfully" });
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

  public handleUpdateUserInterest = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        body: { interest, userId },
        params: { interestId },
      } = req;

      const { error, value: validatedInterest } = stringSchema.validate(
        interest,
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
        await this.usersDb.updateUserInterest({
          id: userId,
          interest: validatedInterest,
          interestId,
        });

        res
          .status(200)
          .json({ data: null, message: "Interest updated successfully" });
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

  public handleCreateUserResumes = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { resumes, userId } = req.body;

      const { error, value: validatedResumes } = resumeArraySchema.validate(
        resumes,
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
        await this.usersDb.createUserResumes({
          id: userId,
          resumes: validatedResumes,
        });

        res
          .status(200)
          .json({ data: null, message: "Resumes created successfully" });
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
        body: { userId },
        params: { resumeId },
      } = req;

      await this.usersDb.deleteUserResume({
        id: userId,
        resumeId,
      });

      res
        .status(200)
        .json({ data: null, message: "Resume deleted successfully" });
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

  public handleUpdateUserResume = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        body: { resume, userId },
        params: { resumeId },
      } = req;

      const { error, value: validatedResume } = resumeSchema.validate(resume, {
        abortEarly: false,
      });

      if (error) {
        const validationErrors = error.details.map((error) =>
          cleanMessage(error.message)
        );

        res.status(400).json({ data: null, message: validationErrors });
      } else {
        await this.usersDb.updateUserResume({
          id: userId,
          resume: validatedResume,
          resumeId,
        });

        res
          .status(200)
          .json({ data: null, message: "Resume updated successfully" });
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

  // SKILLS

  public handleCreateUserSkills = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { skills, userId } = req.body;

      const { error, value: validatedSkills } = stringArraySchema.validate(
        skills,
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
        await this.usersDb.createUserSkills({
          id: userId,
          skills: validatedSkills,
        });

        res
          .status(200)
          .json({ data: null, message: "Skills created successfully" });
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

  public handleDeleteUserSkill = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        body: { userId },
        params: { skillId },
      } = req;

      await this.usersDb.deleteUserSkill({
        id: userId,
        skillId,
      });

      res
        .status(200)
        .json({ data: null, message: "Skill deleted successfully" });
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

  public handleUpdateUserSkill = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        body: { skill, userId },
        params: { skillId },
      } = req;

      const { error, value: validatedSkill } = stringSchema.validate(skill, {
        abortEarly: false,
      });

      if (error) {
        const validationErrors = error.details.map((error) =>
          cleanMessage(error.message)
        );

        res.status(400).json({ data: null, message: validationErrors });
      } else {
        await this.usersDb.updateUserSkill({
          id: userId,
          skill: validatedSkill,
          skillId,
        });

        res
          .status(200)
          .json({ data: null, message: "Skill updated successfully" });
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
