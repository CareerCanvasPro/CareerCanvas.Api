import { Router } from "express";
import multer from "multer";

import { MediaController } from "../controllers";
// import { handleVerifyAccessToken } from "../middlewares";

export class MediaRoute {
  private readonly allowedContentTypes = [
    "application/pdf",
    "image/heic",
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  private readonly mediaController = new MediaController();

  public path = "/media";

  public router = Router();

  constructor() {
    this.initMiddlewares([
      multer({
        fileFilter: (req, { mimetype }, callback) => {
          if (this.allowedContentTypes.includes(mimetype)) {
            callback(null, true);
          } else {
            req.body.error = { data: null, message: "Unsupported file format" };
            callback(null, false);
          }
        },
      }).single("file"),
    ]);

    this.initRoutes();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public initMiddlewares(middlewares: any[]): void {
    this.router.use(middlewares);
  }

  public initRoutes(): void {
    this.router
      .route("/certificate")
      .delete(this.mediaController.handleRemoveCertificate)
      .post(this.mediaController.handleUploadCertificate);

    this.router
      .route("/profile-picture")
      .delete(this.mediaController.handleRemoveProfilePicture)
      .post(this.mediaController.handleUploadProfilePicture);
  }
}
