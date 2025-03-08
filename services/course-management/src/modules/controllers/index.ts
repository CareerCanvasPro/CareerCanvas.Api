import { Course, Level, Prisma } from "@prisma/client";
import { Request, Response } from "express";

import { cleanMessage } from "../../utils";
import { courseArraySchema } from "../schemas";
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

  public handleCreateCourses = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { courses } = req.body;

      const { error, value: validatedCourses } = courseArraySchema.validate(
        courses,
        {
          abortEarly: false,
        }
      );

      if (error) {
        const validationErrors = error.details.map((error) =>
          cleanMessage(error.message)
        );

        res.status(400).json({ data: null, message: validationErrors });
      } else {
        (validatedCourses as Record<string, unknown>[]).forEach(
          async (course) => {
            const { authors, goals, topic } = course;

            delete course.authors;

            delete course.goals;

            delete course.topic;

            await this.coursesDb.createCourse({
              authors: authors as string[],
              course: course as Omit<
                Course,
                "id" | "createdAt" | "topicId" | "updatedAt"
              >,
              goals: goals as string[],
              topic: topic as string,
            });
          }
        );

        res.status(200).json({
          data: null,
          message: "New courses created successfully",
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
