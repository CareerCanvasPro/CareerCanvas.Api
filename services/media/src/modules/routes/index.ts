import { Router } from "express";
import multer from "multer";

import { MediaController } from "../controllers";
import { handleVerifyAccessToken } from "../middlewares";

export class MediaRoute {
  private readonly mediaController = new MediaController();

  public path = "/media";

  public router = Router();

  constructor() {
    this.initMiddlewares([handleVerifyAccessToken, multer().single("file")]);
    this.initRoutes();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public initMiddlewares(middlewares: any[]): void {
    this.router.use(middlewares);
  }

  public initRoutes(): void {
    this.router
      .route("/profile-picture")
      .delete(this.mediaController.handleRemoveProfilePicture)
      .post(this.mediaController.handleUploadProfilePicture);
  }
}
