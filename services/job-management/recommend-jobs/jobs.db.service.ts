import { Occupation, Prisma } from "@prisma/client";

import { prismaClient } from "./config";
import { generateKeywords } from "./utils";

export const buildQuery = ({
  address,
  interests,
  occupations,
  skills,
}: {
  address: string;
  interests: string[];
  occupations: Occupation[];
  skills: string[];
}): { query: Prisma.JobWhereInput } => {
  const query: Prisma.JobWhereInput = {};

  query.deadline = {
    gte: new Date(),
  };

  const { keywords } = generateKeywords({ string: address });

  query.AND = [
    {
      OR: [
        { locationType: "REMOTE" },
        {
          AND: [
            { locationType: { not: "REMOTE" } },
            {
              OR: keywords.map((keyword) => ({
                location: { contains: keyword, mode: "insensitive" },
              })),
            },
          ],
        },
      ],
    },
  ];

  const orConditions: Prisma.JobWhereInput = { OR: [] };

  if (interests && interests.length > 0) {
    interests.forEach((interest) => {
      const { keywords } = generateKeywords({ string: interest });

      keywords.forEach((keyword) => {
        orConditions.OR?.push({
          position: {
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
        orConditions.OR?.push({
          position: {
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
        orConditions.OR?.push({
          position: {
            contains: keyword,
            mode: "insensitive",
          },
        });
      });
    });
  }

  if (orConditions.OR && orConditions.OR.length > 0) {
    query.AND.push(orConditions);
  }

  return { query };
};

export const findJobsByQuery = async ({
  query,
}: {
  query: Prisma.JobWhereInput;
}): Promise<{
  jobs: Prisma.JobGetPayload<{
    include: { users: { select: { id: true } } };
  }>[];
}> => {
  const jobs = await prismaClient.job.findMany({
    include: { users: { select: { id: true } } },
    where: query,
  });

  return { jobs };
};
