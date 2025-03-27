import { Course } from "@prisma/client";
import { Request, Response } from "express";

import { cleanMessage } from "../../utils";
import { courseArraySchema } from "../schemas";
import { CoursesDb } from "../services";

export class CourseManagementController {
  private readonly coursesDb = new CoursesDb();

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
        for (const course of validatedCourses) {
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
}
