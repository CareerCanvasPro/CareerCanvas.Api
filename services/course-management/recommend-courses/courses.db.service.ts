import { Education, Occupation, Prisma } from "@prisma/client";

import { prismaClient } from "./config";
import { generateKeywords } from "./utils";

export const buildQuery = ({
  educations,
  interests,
  occupations,
  skills,
}: {
  educations: Education[];
  interests: string[];
  occupations: Occupation[];
  skills: string[];
}): { query: Prisma.CourseWhereInput } => {
  const query: Prisma.CourseWhereInput = { OR: [] };

  if (educations && educations.length > 0) {
    educations.forEach((education) => {
      const { keywords } = generateKeywords({ string: education.field });

      keywords.forEach((keyword) => {
        query.OR?.push({
          name: {
            contains: keyword,
            mode: "insensitive",
          },
        });
      });
    });
  }

  if (interests && interests.length > 0) {
    interests.forEach((interest) => {
      const { keywords } = generateKeywords({ string: interest });

      keywords.forEach((keyword) => {
        query.OR?.push({
          name: {
            contains: keyword,
            mode: "insensitive",
          },
        });
      });
    });
  }

  if (occupations && occupations.length > 0) {
    occupations.forEach((occupation) => {
      const { keywords } = generateKeywords({ string: occupation.designation });

      keywords.forEach((keyword) => {
        query.OR?.push({
          name: {
            contains: keyword,
            mode: "insensitive",
          },
        });
      });
    });
  }

  if (skills && skills.length > 0) {
    skills.forEach((skill) => {
      const { keywords } = generateKeywords({ string: skill });

      keywords.forEach((keyword) => {
        query.OR?.push({
          name: {
            contains: keyword,
            mode: "insensitive",
          },
        });
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
