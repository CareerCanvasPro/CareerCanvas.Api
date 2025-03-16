import { RequestHandler, Router } from "express";

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

  private initMiddlewares = (middlewares: RequestHandler[]): void => {
    this.router.use(middlewares);
  };

  private initRoutes = (): void => {
    // this.router
    //   .route("/post")
    //   .post(this.courseManagementController.handleCreateCourses);

    this.initMiddlewares([handleVerifyAccessToken]);

    this.router
      .route("/recommendation")
      .get(this.courseManagementController.handleRetrieveRecommendedCourses);

    this.router
      .route("/recommendation/goals")
      .get(
        this.courseManagementController
          .handleRetrieveRecommendedCoursesBasedOnGoals
      );

    this.router
      .route("/search")
      .get(this.courseManagementController.handleSearchCourses);
  };
}
