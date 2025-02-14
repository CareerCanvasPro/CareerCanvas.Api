import { Router } from "express";

import { UserManagementController } from "../controllers";
import { handleVerifyAccessToken } from "../middlewares";

export class UserManagementRoute {
  private readonly userManagementController = new UserManagementController();

  public path = "/user";

  public router = Router();

  constructor() {
    this.initMiddlewares([handleVerifyAccessToken]);
    this.initRoutes();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private initMiddlewares = (middlewares: any[]): void => {
    this.router.use(middlewares);
  };

  private initRoutes = (): void => {
    this.router
      .route("/profile")
      .post(this.userManagementController.handleCreateProfile)
      .delete(this.userManagementController.handleDeleteProfile)
      .get(this.userManagementController.handleGetProfile)
      .put(this.userManagementController.handleUpdateProfile);
  };
}
