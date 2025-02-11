import { Router } from "express";

import { PersonalityTestController } from "../controllers";
// import { handleVerifyAccessToken } from "../middlewares";

export class PersonalityTestRoute {
  private readonly personalityTestController = new PersonalityTestController();

  public readonly path = "/personality-test";

  public readonly router = Router();

  constructor() {
    this.initRoutes();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private initMiddlewares = (middlewares: any[]): void => {
    this.router.use(middlewares);
  };

  private initRoutes = (): void => {
    this.router
      .route("/questions")
      .get(this.personalityTestController.handleRetrieveQuestions);

    this.router
      .route("/result")
      .post(this.personalityTestController.handleEnterResult)
      .get(this.personalityTestController.handleRetrieveResult)
      .put(this.personalityTestController.handleUpdateResult);
  };
}
