import { Router } from "express";

import { CourseManagementController } from "../controllers";
import { handleVerifyAccessToken } from "../middlewares";

export class CourseManagementRoute {
  private readonly courseManagementController =
    new CourseManagementController();

  public readonly path = "/courses";

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
      .route("/post")
      .post(this.courseManagementController.handlePostCourse);

    this.initMiddlewares([handleVerifyAccessToken]);

    this.router
      .route("/recommendation")
      .get(this.courseManagementController.handleRetrieveRecommendedCourses);

    this.router
      .route("/search")
      .get(this.courseManagementController.handleSearchCourses);
  };
}
