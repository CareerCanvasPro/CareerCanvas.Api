import { Course } from "@prisma/client";

import { prismaClient } from "./config";

export const createCourse = async ({
  course,
  tags,
}: {
  course: Omit<Course, "id" | "createdAt" | "updatedAt">;
  tags: string[];
}): Promise<void> => {
  await prismaClient.course.create({
    data: {
      ...course,
      tags: {
        connectOrCreate: tags.map((tag) => ({
          create: {
            name: tag,
          },
          where: {
            name: tag,
          },
        })),
      },
    },
  });
};
