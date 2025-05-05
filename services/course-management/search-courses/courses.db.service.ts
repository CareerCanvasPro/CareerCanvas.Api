import { Prisma } from "@prisma/client";

import { prismaClient } from "./config";
import { splitKeyword } from "./utils";

export const buildQuery = ({
  keyword,
}: {
  keyword: string | undefined;
}): { query: Prisma.CourseWhereInput } => {
  const query: Prisma.CourseWhereInput = { OR: [] };

  if (keyword) {
    const { keywords } = splitKeyword({ keyword });

    keywords.forEach((keyword) => {
      query.OR?.push({
        name: {
          contains: keyword,
          mode: "insensitive",
        },
      });
    });
  }

  return { query: query.OR && query.OR.length > 0 ? query : {} };
};

export const findCoursesByQuery = async ({
  query,
}: {
  query: Prisma.CourseWhereInput;
}): Promise<{
  courses: Prisma.CourseGetPayload<{
    include: {
      tags: true;
      users: true;
    };
  }>[];
}> => {
  const courses = await prismaClient.course.findMany({
    include: {
      tags: true,
      users: true,
    },
    where: query,
  });

  return { courses };
};
