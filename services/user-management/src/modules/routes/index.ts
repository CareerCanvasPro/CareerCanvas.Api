import { RequestHandler, Router } from "express";

import { UserManagementController } from "../controllers";
import { handleVerifyAccessToken } from "../middlewares";

export class UserManagementRoute {
  private readonly userManagementController = new UserManagementController();

  public readonly path = "/user";

  public readonly router = Router();

  constructor() {
    this.initMiddlewares([handleVerifyAccessToken]);
    this.initRoutes();
  }

  private initMiddlewares = (middlewares: RequestHandler[]): void => {
    this.router.use(middlewares);
  };

  private initRoutes = (): void => {
    this.router
      .route("/")
      .post(this.userManagementController.handleCreateUser)
      .get(this.userManagementController.handleFindUser)
      .delete(this.userManagementController.handleDeleteUser);

    this.router
      .route("/about-me")
      .put(this.userManagementController.handleUpdateUserAboutMe);

    this.router
      .route("/address")
      .put(this.userManagementController.handleUpdateUserAddress);

    this.router
      .route("/fcm-token")
      .put(this.userManagementController.handleUpdateUserFcmToken);

    this.router
      .route("/name")
      .put(this.userManagementController.handleUpdateUserName);

    this.router
      .route("/profile-picture")
      .put(this.userManagementController.handleUpdateUserProfilePicture);

    this.router
      .route("/appreciations")
      .post(this.userManagementController.handleCreateUserAppreciation);

    this.router
      .route("/appreciations/:appreciationId")
      .put(this.userManagementController.handleUpdateUserAppreciation)
      .delete(this.userManagementController.handleDeleteUserAppreciation);

    this.router
      .route("/educations")
      .post(this.userManagementController.handleCreateUserEducations);

    this.router
      .route("/educations/:educationId")
      .put(this.userManagementController.handleUpdateUserEducation)
      .delete(this.userManagementController.handleDeleteUserEducation);

    this.router
      .route("/goals")
      .put(this.userManagementController.handleUpdateUserGoals);

    this.router
      .route("/interests")
      .put(this.userManagementController.handleUpdateUserInterests);

    this.router
      .route("/occupations")
      .post(this.userManagementController.handleCreateUserOccupations);

    this.router
      .route("/occupations/:occupationId")
      .put(this.userManagementController.handleUpdateUserOccupation)
      .delete(this.userManagementController.handleDeleteUserOccupation);

    this.router
      .route("/resumes")
      .post(this.userManagementController.handleCreateUserResume);

    this.router
      .route("/resumes/:resumeId")
      .delete(this.userManagementController.handleDeleteUserResume);

    this.router
      .route("/skills")
      .put(this.userManagementController.handleUpdateUserSkills);
  };
}
