import { Course, Level, Prisma } from "@prisma/client";

import { prismaClient } from "../../config";

export class CoursesDb {
  public buildQuery = ({
    durations,
    goals,
    interests,
    keyword,
    levels,
  }: {
    durations?: number[][] | null | undefined;
    goals?: string[] | null | undefined;
    interests?: string[] | null | undefined;
    keyword?: string | null | undefined;
    levels?: Level[] | null | undefined;
  }): { query: Prisma.CourseWhereInput } => {
    const query: Prisma.CourseWhereInput = {};

    if (durations && durations.length) {
      query.OR = durations.map((duration) => ({
        duration: {
          gte: duration[0],
          ...(duration[1] && { lte: duration[1] }),
        },
      }));
    }

    if (goals && goals.length) {
      query.goals = {
        some: {
          name: {
            in: goals,
          },
        },
      };
    }

    if (interests && interests.length) {
      query.topic = {
        name: {
          in: interests,
        },
      };
    }

    if (keyword) {
      query.OR = [
        {
          authors: {
            some: {
              name: {
                contains: keyword,
                mode: "insensitive",
              },
            },
          },
        },
        {
          name: {
            contains: keyword,
            mode: "insensitive",
          },
        },
        {
          topic: {
            name: {
              contains: keyword,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    if (levels && levels.length) {
      query.level = {
        in: levels,
      };
    }

    return { query };
  };

  public createCourse = async ({
    course,
    authors,
    goals,
    topic,
  }: {
    course: Omit<Course, "id" | "createdAt" | "topicId" | "updatedAt">;
    authors: string[];
    goals: string[];
    topic: string;
  }): Promise<void> => {
    await prismaClient.course.create({
      data: {
        ...course,
        authors: {
          connectOrCreate: authors.map((author) => ({
            create: {
              name: author,
            },
            where: {
              name: author,
            },
          })),
        },
        goals: {
          connectOrCreate: goals.map((goal) => ({
            create: {
              name: goal,
            },
            where: {
              name: goal,
            },
          })),
        },
        topic: {
          connectOrCreate: {
            create: {
              name: topic,
            },
            where: {
              name: topic,
            },
          },
        },
      },
    });
  };

  public findAllCourses = async (): Promise<{
    courses: Prisma.CourseGetPayload<{
      include: {
        authors: true;
        goals: true;
        topic: true;
      };
    }>[];
  }> => {
    const courses = await prismaClient.course.findMany({
      include: {
        authors: true,
        goals: true,
        topic: true,
      },
    });

    return { courses };
  };

  public findCoursesByQuery = async ({
    query,
  }: {
    query: Prisma.CourseWhereInput;
  }): Promise<{
    courses: Prisma.CourseGetPayload<{
      include: {
        authors: true;
        goals: true;
        topic: true;
      };
    }>[];
  }> => {
    const courses = await prismaClient.course.findMany({
      include: {
        authors: true,
        goals: true,
        topic: true,
      },
      where: query,
    });

    return { courses };
  };
}
