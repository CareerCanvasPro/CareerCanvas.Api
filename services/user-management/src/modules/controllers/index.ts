import { Request, Response } from "express";

import { cleanMessage } from "../../utils";
import { createProfileSchema, updateProfileSchema } from "../schemas";
import { UsersDB } from "../services";

export class UserManagementController {
  private readonly usersDB = new UsersDB();

  public handleCreateProfile = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      delete req.body.exp;

      delete req.body.iat;

      const { error, value } = createProfileSchema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        const validationErrors = error.details.map((error) =>
          cleanMessage(error.message)
        );

        res.status(400).json({ data: null, message: validationErrors });
      } else {
        const { address, email, name, phone, profilePicture, userID } = value;

        const { user } = await this.usersDB.getUser({
          keyValue: userID,
        });

        if (user) {
          res
            .status(409)
            .json({ data: null, message: "Profile already exists" });
        } else {
          if (address && email && name && phone && profilePicture) {
            const coins = 10;

            const { httpStatusCode } = await this.usersDB.putUser({
              user: { ...value, coins },
            });

            res.status(httpStatusCode).json({
              data: { coins },
              message: "New profile created successfully",
            });
          } else {
            const coins = 5;

            const { httpStatusCode } = await this.usersDB.putUser({
              user: { ...value, coins },
            });

            res.status(httpStatusCode).json({
              data: { coins },
              message: "New profile created successfully",
            });
          }
        }
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

  public handleDeleteProfile = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { userID } = req.body;

      const { deletedUser, httpStatusCode } = await this.usersDB.deleteUser({
        keyValue: userID,
      });

      if (deletedUser) {
        res
          .status(httpStatusCode)
          .json({ data: null, message: "Profile deleted successfully" });
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

  public handleGetProfile = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { userID } = req.body;

      const { httpStatusCode, user } = await this.usersDB.getUser({
        keyValue: userID,
      });

      if (user) {
        res
          .status(httpStatusCode)
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

  public handleUpdateProfile = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { userID } = req.body;

      delete req.body.exp;

      delete req.body.iat;

      delete req.body.userID;

      delete req.body.username;

      const { error, value } = updateProfileSchema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        const validationErrors = error.details.map((error) =>
          cleanMessage(error.message)
        );

        res.status(400).json({ data: null, message: validationErrors });
      } else {
        const { user } = await this.usersDB.getUser({
          keyValue: userID,
        });

        if (!user) {
          res.status(404).json({ data: user, message: "Profile not found" });
        } else {
          const { education, occupation, skills } = value;

          const attributes = Object.entries(value).map(([name, value]) => ({
            name,
            value,
          }));
          // when deleting education, set education to empty array or null and isEducationDeleted to true
          if (
            education &&
            education.length &&
            !user.education && // education must not exist in db before
            !user.isEducationDeleted // education must not have deleted status set to true
          ) {
            attributes.push({
              name: "coins",
              value: (user.coins as number) + 5,
            });
          }
          // Similar to education
          if (
            occupation &&
            occupation.length &&
            !user.isOccupationDeleted &&
            !user.occupation
          ) {
            attributes.push({
              name: "coins",
              value: (user.coins as number) + 5,
            });
          }
          // Similar to education
          if (
            skills &&
            skills.length &&
            !user.isSkillsDeleted &&
            !user.skills
          ) {
            attributes.push({
              name: "coins",
              value: (user.coins as number) + 5,
            });
          }

          const { httpStatusCode, updatedUser } = await this.usersDB.updateUser(
            {
              attributes,
              keyValue: userID,
            }
          );

          res.status(httpStatusCode).json({
            data: { coins: updatedUser.coins },
            message: "Profile updated successfully",
          });
        }
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

  //   updateProfilePicture = async (req: Request, res: Response) => {
  //     // Validate request body
  //     const result = validationResult(req.body);
  //     if (!result.isEmpty()) {
  //       return res.status(422).json({ errors: result.array() });
  //     }

  //     const requestedFrom = req.headers["requestedfrom"];
  //     const logger = new Logger(
  //       "user-management-service",
  //       `UPDATEPROFILEPICTURE-${req.body.username}`,
  //       requestedFrom
  //     );
  //     const { username, profilePicture } = req.body;

  //     logger.info("Received request to update profile picture", {
  //       username,
  //       profilePicture,
  //     });

  //     const userService = new UserManagementService(this.TableName, username);

  //     try {
  //       const user = await userService.getItem(username);

  //       if (!user?.user) {
  //         logger.error("User not found", { username });
  //         return res.status(404).json({ error: "User not found" });
  //       }

  //       const updateExpression = "SET #profilePicture = :profilePicture";
  //       const expressionAttributeNames: { [key: string]: string } = {};
  //       const expressionAttributeValues: { [key: string]: any } = {};

  //       const updatedProfilePictureUrl = "";

  //       // Perform the update operation
  //       const success = await userService.updateItem(
  //         updateExpression,
  //         expressionAttributeNames,
  //         expressionAttributeValues
  //       );

  //       if (success?.data) {
  //         const responseMeta = success?.data?.$metadata;
  //         const statusCode = success?.data.$metadata?.httpStatusCode;

  //         logger.info("Profile picture updated successfully", {
  //           statusCode,
  //           responseMeta,
  //         });

  //         return res.status(statusCode).json({ Data: responseMeta }).end();
  //       } else {
  //         logger.error("Failed to update profile picture", { username });
  //         return res.status(402).json({ Data: "Failed" }).end();
  //       }
  //     } catch (error) {
  //       logger.error("Error updating profile picture", { error: error });
  //       return res
  //         .status(500)
  //         .json({ error: "Failed to update profile picture" });
  //     }
  //   };

  //   updateSetting = (req: Request, res: Response) => {
  //     const requestedFrom = req.headers["requestedfrom"];
  //     const logger = new Logger(
  //       "user-management-service",
  //       `UPDATESETTING-${req.body.username}`,
  //       requestedFrom
  //     );
  //     const { username, matchPreference } = req.body;

  //     logger.info("Received request to update match preferences", {
  //       username,
  //       matchPreference,
  //     });

  //     const userService = new UserManagementService(this.TableName, username);

  //     userService
  //       .updateMatchPreference(username, matchPreference)
  //       .then((success) => {
  //         if (success) {
  //           logger.info("Match preferences updated successfully", {
  //             username,
  //             matchPreference,
  //           });
  //           res.status(200).json({ Data: success }).end();
  //         } else {
  //           logger.warning(
  //             "Failed to update match preferences, invalid response",
  //             { username, matchPreference }
  //           );
  //           res
  //             .status(400)
  //             .json({ error: "Failed to update match preferences" })
  //             .end();
  //         }
  //       })
  //       .catch((error) => {
  //         logger.error("Error updating match preferences", { error });
  //         res.status(500).json({
  //           error:
  //             error.message ||
  //             "An error occurred while updating match preferences",
  //         });
  //       });
  //   };

  //   attrchange = async (req: Request, res: Response) => {
  //     const requestedFrom = req.headers["requestedfrom"];
  //     const logger = new Logger(
  //       "user-management-service",
  //       `ATTRCHANGE-${req.body.username}`,
  //       requestedFrom
  //     );
  //     const myUUID = uuidv4();
  //     const { username, data } = req.body;

  //     // Adding necessary attributes to the request data
  //     data.user = username;
  //     data.id = myUUID;

  //     logger.info("Received request to create attribute change", {
  //       username,
  //       data,
  //     });

  //     const userService = new UserManagementService(
  //       this.AttributeTableName,
  //       username
  //     );

  //     try {
  //       // Create an attribute change request
  //       const success = await userService.createAttributeChangeRequest(data);

  //       if (success) {
  //         logger.info("Attribute change request created successfully", {
  //           username,
  //           data,
  //         });
  //         res.status(200).json({ Data: success }).end();
  //       } else {
  //         logger.warning(
  //           "Failed to create attribute change request, invalid response",
  //           { username, data }
  //         );
  //         res
  //           .status(400)
  //           .json({ error: "Failed to create attribute change request" })
  //           .end();
  //       }
  //     } catch (error) {
  //       logger.error("Error creating attribute change request", { error });
  //       res.status(500).json({
  //         error:
  //           error.message ||
  //           "An error occurred while creating the attribute change request",
  //       });
  //     }
  //   };
}
