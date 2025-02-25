import { Router } from "express";

import { JobManagementController } from "../controllers";
import { handleVerifyAccessToken } from "../middlewares";

export class JobManagementRoute {
  private readonly jobManagementController = new JobManagementController();

  public readonly path = "/jobs";

  public readonly router = Router();

  constructor() {
    this.initRoutes();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private initMiddlewares = (middlewares: any[]): void => {
    this.router.use(middlewares);
  };

  private initRoutes = (): void => {
    // this.router
    //   .route("/post")
    //   .post(this.jobManagementController.handlePostJobs);

    this.initMiddlewares([handleVerifyAccessToken]);

    this.router
      .route("/career-trends")
      .get(this.jobManagementController.handleRetrieveCareerTrends);

    this.router
      .route("/recommendation")
      .get(this.jobManagementController.handleRetrieveRecommendedJobs);

    this.router
      .route("/search")
      .get(this.jobManagementController.handleSearchJobs);
  };
}
