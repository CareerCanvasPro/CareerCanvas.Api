import { validateJwt } from "cm-authenticator";
import * as express from "express";

import UserServiceController from "./controller";
const userServiceController = new UserServiceController();

export default class ServiceRoutes {
  public path = "/user";
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.post(
      "/profile",
      validateJwt,
      userServiceController.createProfile
    );
    this.router.put(
      "/profile",
      validateJwt,
      userServiceController.updateProfile
    );
    this.router.get("/profile", validateJwt, userServiceController.getProfile);
    this.router.put(
      "/profilepicture",
      validateJwt,
      userServiceController.updateProfilePicture
    );
    this.router.post(
      "/attrchange",
      validateJwt,
      userServiceController.attrchange
    );
    this.router.post(
      "/settings",
      validateJwt,
      userServiceController.updateSetting
    );
  }
}
