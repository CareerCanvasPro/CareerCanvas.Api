import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import { DB } from "../../../../../utility/db";
import { cleanMessage } from "../../utils";
import { postCoursesSchema } from "../schemas";
import { CoursesDB } from "../services";

type Level = "beginner" | "intermediate" | "expert";

interface ExtractDurationParams {
  duration: string | string[];
}

interface FilterCoursesParams {
  courses: Record<string, unknown>[];
  duration: string | string[] | undefined;
  keyword: string | undefined;
  level: Level | Level[] | undefined;
}

interface ShuffleCoursesParams {
  courses: Record<string, unknown>[];
}

export class CourseManagementController {
  private readonly db = new DB();

  private readonly coursesDB = new CoursesDB();

  private extractDuration = ({ duration }: ExtractDurationParams): string[][] =>
    Array.isArray(duration)
      ? duration.map((value) =>
          value.includes("+") ? [value.slice(0, -1), ""] : value.split("-")
        )
      : duration.includes("+")
      ? [[duration.slice(0, -1), ""]]
      : [duration.split("-")];

  private filterCourses = ({
    courses,
    duration,
    keyword,
    level,
  }: FilterCoursesParams): {
    filteredCourses: Record<string, unknown>[];
  } => {
    const filteredCourses = courses.filter((course) => {
      const flags: boolean[] = [];

      if (duration) {
        const extractedDuration = this.extractDuration({ duration });

        flags.push(
          extractedDuration.some(
            (value) =>
              (course.duration as number) >= parseFloat(value[0]) &&
              (course.duration as number) <= parseFloat(value[1])
          )
        );
      }

      if (keyword) {
        flags.push(
          (course.name as string).toLowerCase().includes(keyword) ||
            (course.topic as string).toLowerCase().includes(keyword) ||
            (course.creators as string[]).some((creator) =>
              creator.toLowerCase().includes(keyword)
            )
        );
      }

      if (level) {
        flags.push(
          Array.isArray(level)
            ? level.some((value) => course.level === value)
            : course.level === level
        );
      }

      return flags.every((flag) => flag === true);
    });

    return { filteredCourses };
  };

  private shuffleCourses = ({
    courses,
  }: ShuffleCoursesParams): { shuffledCourses: Record<string, unknown>[] } => {
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
      const { userID } = req.query;

      const { item: user } = await this.db.getItem({
        key: { name: "userID", value: userID as string },
        tableName: "userprofiles",
      });

      if (user) {
        const { interests } = user;

        if (!interests || !(interests as string[]).length) {
          const { courses, httpStatusCode } =
            await this.coursesDB.getAllCourses();

          const { shuffledCourses } = this.shuffleCourses({ courses });

          if (shuffledCourses.length > 10) {
            res.status(httpStatusCode).json({
              data: { courses: shuffledCourses.slice(0, 10) },
              message: "Recommended courses retrieved successfully",
            });
          } else {
            res.status(httpStatusCode).json({
              data: { courses: shuffledCourses },
              message: "Recommended courses retrieved successfully",
            });
          }
        } else {
          const { courses, httpStatusCode } = await this.coursesDB.scanCourses({
            attributes: [{ name: "topic", value: interests as string[] }],
          });

          const { shuffledCourses } = this.shuffleCourses({ courses });

          if (shuffledCourses.length > 10) {
            res.status(httpStatusCode).json({
              data: { courses: shuffledCourses.slice(0, 10) },
              message: "Recommended courses retrieved successfully",
            });
          } else {
            res.status(httpStatusCode).json({
              data: { courses: shuffledCourses },
              message: "Recommended courses retrieved successfully",
            });
          }
        }
      } else {
        res.status(404).json({ data: user, message: "Profile not found" });
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

      const { courses, httpStatusCode } = await this.coursesDB.getAllCourses();

      const { filteredCourses } = this.filterCourses({
        courses,
        duration: duration as string | string[] | undefined,
        keyword: keyword as string | undefined,
        level: level as Level | Level[] | undefined,
      });

      res.status(httpStatusCode).json({
        data: { courses: filteredCourses },
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
