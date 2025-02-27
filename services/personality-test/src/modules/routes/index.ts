import { RequestHandler, Router } from "express";

import { PersonalityTestController } from "../controllers";
import { handleVerifyAccessToken } from "../middlewares";

export class PersonalityTestRoute {
  private readonly personalityTestController = new PersonalityTestController();

  public readonly path = "/personality-test";

  public readonly router = Router();

  constructor() {
    this.initRoutes();
  }

  private initMiddlewares = (middlewares: RequestHandler[]): void => {
    this.router.use(middlewares);
  };

  private initRoutes = (): void => {
    this.router
      .route("/questions")
      .post(this.personalityTestController.handlePostQuestions);

    this.initMiddlewares([handleVerifyAccessToken]);

    this.router
      .route("/questions")
      .get(this.personalityTestController.handleRetrieveQuestions);

    this.router
      .route("/result")
      .post(this.personalityTestController.handleEnterResult);
  };
}
