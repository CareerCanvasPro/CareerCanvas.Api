import { Level, Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import { cleanMessage } from "../../utils";
import { postCoursesSchema } from "../schemas";
import { CoursesDb, UsersDb } from "../services";

export class CourseManagementController {
  private readonly coursesDb = new CoursesDb();

  private readonly usersDb = new UsersDb();

  private extractDurations = ({
    durations,
  }: {
    durations: string[];
  }): number[][] =>
    durations.map((duration) =>
      duration.split("-").map((value) => parseInt(value, 10))
    );

  private shuffleCourses = ({
    courses,
  }: {
    courses: Prisma.CourseGetPayload<{
      include: {
        authors: true;
        goals: true;
        topic: true;
      };
    }>[];
  }): {
    shuffledCourses: Prisma.CourseGetPayload<{
      include: {
        authors: true;
        goals: true;
        topic: true;
      };
    }>[];
  } => {
    const shuffledCourses = [...courses];

    for (let i = shuffledCourses.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [shuffledCourses[i], shuffledCourses[j]] = [
        shuffledCourses[j],
        shuffledCourses[i],
      ];
    }

    return { shuffledCourses };
  };

  public handlePostCourses = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      delete req.body.exp;

      delete req.body.iat;

      const { error, value } = postCoursesSchema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        const validationErrors = error.details.map((error) =>
          cleanMessage(error.message)
        );

        res.status(400).json({ data: null, message: validationErrors });
      } else {
        (value as Record<string, unknown>[]).forEach(
          async (value) =>
            await this.coursesDB.putCourse({
              course: { ...value, courseID: uuidv4() },
            })
        );

        res.status(200).json({
          data: null,
          message: "New courses posted successfully",
        });
      }
    } catch (error) {
      if (error.$metadata && error.$metadata.httpStatusCode) {
        res
          .status(error.$metadata.httpStatusCode)
          .json({ data: null, message: `${error.name}: ${error.message}` });
      } else {
        res
          .status(500)
          .json({ data: null, message: `${error.name}: ${error.message}` });
      }
    }
  };

  public handleRetrieveRecommendedCourses = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { userId } = req.body;

      const { user } = await this.usersDb.findUser({ id: userId });

      if (user) {
        const { interests } = user;

        const { query } = this.coursesDb.buildQuery({
          interests: interests
            ? interests.map((interest) => interest.name)
            : null,
        });

        const { courses } = await this.coursesDb.findCoursesByQuery({ query });

        const { shuffledCourses } = this.shuffleCourses({ courses });

        if (shuffledCourses.length > 10) {
          res.status(200).json({
            data: { courses: shuffledCourses.slice(0, 10) },
            message: "Recommended courses retrieved successfully",
          });
        } else {
          res.status(200).json({
            data: { courses: shuffledCourses },
            message: "Recommended courses retrieved successfully",
          });
        }
      } else {
        res.status(404).json({ data: null, message: "Profile not found" });
      }
    } catch (error) {
      if (error.$metadata && error.$metadata.httpStatusCode) {
        res
          .status(error.$metadata.httpStatusCode)
          .json({ data: null, message: `${error.name}: ${error.message}` });
      } else {
        res
          .status(500)
          .json({ data: null, message: `${error.name}: ${error.message}` });
      }
    }
  };

  public handleRetrieveRecommendedCoursesBasedOnGoals = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { userId } = req.body;

      const { user } = await this.usersDb.findUser({ id: userId });

      if (user) {
        const { goals, interests } = user;

        const { query } = this.coursesDb.buildQuery({
          goals: goals ? goals.map((goal) => goal.name) : null,
          interests: interests
            ? interests.map((interest) => interest.name)
            : null,
        });

        const { courses } = await this.coursesDb.findCoursesByQuery({ query });

        const { shuffledCourses } = this.shuffleCourses({ courses });

        if (shuffledCourses.length > 10) {
          res.status(200).json({
            data: { courses: shuffledCourses.slice(0, 10) },
            message:
              "Recommended courses based on goals retrieved successfully",
          });
        } else {
          res.status(200).json({
            data: { courses: shuffledCourses },
            message:
              "Recommended courses based on goals retrieved successfully",
          });
        }
      } else {
        res.status(404).json({ data: null, message: "Profile not found" });
      }
    } catch (error) {
      if (error.$metadata && error.$metadata.httpStatusCode) {
        res
          .status(error.$metadata.httpStatusCode)
          .json({ data: null, message: `${error.name}: ${error.message}` });
      } else {
        res
          .status(500)
          .json({ data: null, message: `${error.name}: ${error.message}` });
      }
    }
  };

  public handleSearchCourses = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { duration, keyword, level } = req.query;

      const { query } = this.coursesDb.buildQuery({
        durations: duration
          ? Array.isArray(duration)
            ? this.extractDurations({ durations: duration as string[] })
            : this.extractDurations({ durations: [duration as string] })
          : null,
        keyword: keyword as string | undefined,
        levels: level
          ? Array.isArray(level)
            ? (level as Level[])
            : [level as Level]
          : null,
      });

      const { courses } = await this.coursesDb.findCoursesByQuery({ query });

      res.status(200).json({
        data: { courses },
        message: "Search results retrieved successfully",
      });
    } catch (error) {
      if (error.$metadata && error.$metadata.httpStatusCode) {
        res
          .status(error.$metadata.httpStatusCode)
          .json({ data: null, message: `${error.name}: ${error.message}` });
      } else {
        res
          .status(500)
          .json({ data: null, message: `${error.name}: ${error.message}` });
      }
    }
  };
}
